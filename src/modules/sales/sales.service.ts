import {
    Injectable, NotFoundException, BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Op, Sequelize, fn, col, literal, QueryTypes } from 'sequelize';
import { SaleItem } from '../../models/sales_items.model';
import { Sale } from '../../models/sales.model';
import { OutletMenu } from '@/models/outlet_menu.model';
import { CreateSalesDto } from './dto/create-sales.dto';
import { Outlet } from '@/models/outlet.model';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel(Sale)
        private readonly saleModel: typeof Sale,
        @InjectModel(SaleItem)
        private readonly saleItemModel: typeof SaleItem,
        @InjectModel(OutletMenu)
        private readonly outletMenuModel: typeof OutletMenu,
        @InjectModel(Outlet)
        private readonly outletModel: typeof Outlet,

        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) { }

    async create(createSalesDto: CreateSalesDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const {
                outlet_id,
                payment_method,
                discount = 0,
                items,
            } = createSalesDto;

            // Validate items
            if (!items?.length) {
                throw new BadRequestException(
                    'At least one sale item is required',
                );
            }

            // Find assigned menu items for this outlet
            const menuItems = await this.outletMenuModel.findAll({
                where: {
                    outlet_id,
                    menu_item_id: items.map(item => item.menu_item_id),
                    is_available: true,
                },
                transaction,
            });

            if (menuItems.length !== new Set(
                items.map(item => item.menu_item_id),
            ).size) {
                throw new BadRequestException(
                    'Some menu items are not assigned to this outlet',
                );
            }

            // Calculate subtotal using outlet prices
            let subtotal = 0;

            const saleItems = items.map(item => {
                const outletMenu = menuItems.find(
                    menu => menu.menu_item_id === item.menu_item_id,
                );

                const unitPrice = Number(outletMenu.selling_price);
                const totalPrice = unitPrice * item.quantity;

                subtotal += totalPrice;

                return {
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    unit_price: unitPrice,
                    total_price: totalPrice,
                };
            });

            if (discount > subtotal) {
                throw new BadRequestException(
                    'Discount cannot exceed subtotal',
                );
            }

            const totalAmount = subtotal - discount;

            // Create sale
            const sale = await this.saleModel.create(
                {
                    outlet_id,
                    subtotal,
                    discount_amount: discount,
                    total_amount: totalAmount,
                    payment_method,
                },
                { transaction },
            );

            // Create sale items
            await this.saleItemModel.bulkCreate(
                saleItems.map(item => ({
                    ...item,
                    sale_id: sale.id,
                })),
                { transaction },
            );

            await transaction.commit();

            return this.saleModel.findByPk(sale.id, {
                include: [
                    {
                        model: SaleItem,
                        as: 'sale_items',
                    },
                ],
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findByOutletId(outletId: string) {
        const sales = await this.saleModel.findAll({
            where: {
                outlet_id: outletId,
            },
            include: [
                {
                    model: SaleItem,
                    as: 'sale_items',
                },
            ],
            order: [['created_at', 'DESC']],
        });

        if (!sales.length) {
            throw new NotFoundException('Sales not found');
        }

        return sales;
    }

    async getOutletWiseRevenue(query: {
        start_date?: string;
        end_date?: string;
        outlet_id?: string;
    }) {
        const { start_date, end_date, outlet_id } = query;

        const where: any = {};

        if (outlet_id) {
            where.outlet_id = outlet_id;
        }

        if (start_date || end_date) {
            where.created_at = {};

            if (start_date) {
                where.created_at[Op.gte] = new Date(start_date);
            }

            if (end_date) {
                const endDate = new Date(end_date);
                endDate.setHours(23, 59, 59, 999);

                where.created_at[Op.lte] = endDate;
            }
        }

        const revenue = await this.saleModel.findAll({
            attributes: [
                'outlet_id',
                [fn('COUNT', col('Sale.id')), 'total_orders'],
                [fn('SUM', col('Sale.total_amount')), 'total_revenue'],
            ],
            where,
            include: [
                {
                    model: Outlet,
                    as: 'outlet',
                    attributes: ['id', 'name'],
                    required: true,
                },
            ],
            group: ['Sale.outlet_id', 'outlet.id'],
            raw: true,
            nest: true,
        });

        return revenue;
    }


    async getTopSellingItems(query: {
        start_date?: string;
        end_date?: string;
        outlet_id?: string;
    }) {
        const { start_date, end_date, outlet_id } = query;

        const replacements: any = {};

        let dateCondition = '';

        if (start_date) {
            dateCondition += ' AND s.created_at >= :start_date';
            replacements.start_date = start_date;
        }

        if (end_date) {
            dateCondition += ' AND s.created_at < (:end_date::date + INTERVAL \'1 day\')';
            replacements.end_date = end_date;
        }

        let outletCondition = '';

        if (outlet_id) {
            outletCondition = ' AND s.outlet_id = :outlet_id';
            replacements.outlet_id = outlet_id;
        }

        const sql = `
        WITH item_sales AS (
            SELECT
                s.outlet_id,
                o.name AS outlet_name,
                si.menu_item_id,
                mi.name AS item_name,
                SUM(si.quantity) AS total_quantity,
                SUM(si.total_price) AS total_revenue
            FROM sales s
            INNER JOIN sale_items si
                ON si.sale_id = s.id
            INNER JOIN outlets o
                ON o.id = s.outlet_id
            INNER JOIN menu_items mi
                ON mi.id = si.menu_item_id
            WHERE 1=1
                ${dateCondition}
                ${outletCondition}
                AND s.status = 'COMPLETED'
            GROUP BY
                s.outlet_id,
                o.name,
                si.menu_item_id,
                mi.name
        ),
        ranked_items AS (
            SELECT *,
                ROW_NUMBER() OVER (
                    PARTITION BY outlet_id
                    ORDER BY total_quantity DESC, menu_item_id
                ) AS rank
            FROM sale_items
        )
        SELECT *
        FROM ranked_items
        WHERE rank <= 5
        ORDER BY outlet_name, rank;
    `;

        return this.sequelize.query(sql, {
            replacements,
            type: QueryTypes.SELECT,
        });
    }

}







