


import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Op, Sequelize, fn, col, literal, QueryTypes } from 'sequelize';

import { SaleItem } from '../../models/sales_items.model';
import { Sale } from '../../models/sales.model';
import { OutletMenu } from '@/models/outlet_menu.model';
import { Outlet } from '@/models/outlet.model';
import { MenuItem } from '@/models/menu_items.model';
import { COMPANY_ID } from '@/common/constants';

import { CreateSalesDto } from './dto/create-sales.dto';
import { Inventory } from '@/models/inventories.model';
import { InventoryTransaction, InventoryTransactionType } from '@/models/inventory_transactions.model';

@Injectable()
export class SalesService {
    constructor(
        @InjectConnection()
        private readonly sequelize: Sequelize,

        @InjectModel(Sale)
        private readonly saleModel: typeof Sale,

        @InjectModel(SaleItem)
        private readonly saleItemModel: typeof SaleItem,

        @InjectModel(Inventory)
        private readonly inventoryModel: typeof Inventory,

        @InjectModel(InventoryTransaction)
        private readonly inventoryTransactionModel: typeof InventoryTransaction,

        @InjectModel(OutletMenu)
        private readonly outletMenuModel: typeof OutletMenu,

        @InjectModel(Outlet)
        private readonly outletModel: typeof Outlet,

        @InjectModel(MenuItem)
        private readonly menuItemModel: typeof MenuItem,
    ) { }

    // async create(dto: CreateSalesDto, user: any) {
    //     const transaction = await this.sequelize.transaction();

    //     try {
    //         const {
    //             outlet_id,
    //             sale_date,
    //             payment_method,
    //             items,
    //         } = dto;

    //         const createdBy = Number(user?.sub ?? user?.id);

    //         if (!Number.isInteger(createdBy) || createdBy <= 0) {
    //             throw new BadRequestException('Invalid authenticated user');
    //         }

    //         // Reject duplicate menu items in the API payload.
    //         const menuIds = items.map((item) => Number(item.menu_item_id));

    //         if (new Set(menuIds).size !== menuIds.length) {
    //             throw new BadRequestException(
    //                 'Duplicate menu items are not allowed',
    //             );
    //         }

    //         // Lock outlet row to serialize invoice generation
    //         // for sales created at the same outlet.
    //         const outlet = await this.outletModel.findByPk(outlet_id, {
    //             transaction,
    //             lock: transaction.LOCK.UPDATE,
    //         });

    //         if (!outlet) {
    //             throw new NotFoundException('Outlet not found');
    //         }

    //         const preparedItems = [];
    //         let subtotal = 0;

    //         // Sort IDs to maintain consistent inventory lock order.
    //         const sortedItems = [...items].sort(
    //             (a, b) => a.menu_item_id - b.menu_item_id,
    //         );

    //         // ------------------------------------
    //         // 1. VALIDATE MENU AND INVENTORY
    //         // ------------------------------------

    //         for (const item of sortedItems) {
    //             const quantity = Number(item.quantity);

    //             if (!Number.isFinite(quantity) || quantity <= 0) {
    //                 throw new BadRequestException('Invalid sale quantity');
    //             }

    //             // Find outlet menu
    //             const outletMenu = await this.outletMenuModel.findOne({
    //                 where: {
    //                     outlet_id,
    //                     menu_item_id: item.menu_item_id,
    //                     is_available: true,
    //                 },
    //                 transaction,
    //             });

    //             if (!outletMenu) {
    //                 throw new BadRequestException(
    //                     `Menu item ${item.menu_item_id} is unavailable`,
    //                 );
    //             }

    //             // Find inventory directly using menu_item_id
    //             const inventory = await this.inventoryModel.findOne({
    //                 where: {
    //                     outlet_id,
    //                     menu_item_id: item.menu_item_id,
    //                     is_active: true,
    //                 },
    //                 transaction,
    //                 lock: transaction.LOCK.UPDATE,
    //             });

    //             if (!inventory) {
    //                 throw new BadRequestException(
    //                     `Inventory not configured for menu item ${item.menu_item_id}`,
    //                 );
    //             }

    //             const currentStock = Number(inventory.quantity);
    //             const reservedStock = Number(
    //                 inventory.reserved_quantity || 0,
    //             );

    //             const availableStock = currentStock - reservedStock;

    //             if (quantity > availableStock) {
    //                 throw new BadRequestException(
    //                     `Insufficient stock for menu item ${item.menu_item_id}. ` +
    //                     `Available: ${availableStock.toFixed(3)}`,
    //                 );
    //             }

    //             const menuItem = await this.menuItemModel.findByPk(
    //                 item.menu_item_id,
    //                 { transaction },
    //             );

    //             const sellingPrice = Number(outletMenu.selling_price);

    //             if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
    //                 throw new BadRequestException('Invalid menu selling price');
    //             }

    //             const totalPrice = quantity * sellingPrice;

    //             subtotal += totalPrice;

    //             preparedItems.push({
    //                 inventory,
    //                 menu_item_id: item.menu_item_id,
    //                 inventory_item_id: inventory.inventory_item_id,
    //                 item_name: menuItem?.name || `Menu ${item.menu_item_id}`,
    //                 quantity,
    //                 unit_price: sellingPrice,
    //                 discount: 0,
    //                 total_price: totalPrice,
    //             });
    //         }

    //         // ------------------------------------
    //         // 2. GENERATE INVOICE NUMBER
    //         // ------------------------------------

    //         const invoiceNo = await this.generateInvoiceNo(
    //             outlet_id
    //         );

    //         // ------------------------------------
    //         // 3. CREATE SALE
    //         // ------------------------------------

    //         const saleData = {
    //             company_id: COMPANY_ID,
    //             outlet_id: Number(outlet_id),
    //             invoice_no: await this.generateInvoiceNo(outlet_id),
    //             sale_date: new Date(sale_date) || new Date(),
    //             subtotal: Number(subtotal.toFixed(2)),
    //             discount_amount: 0,
    //             tax_amount: 0,
    //             total_amount: Number(subtotal.toFixed(2)),
    //             payment_method,
    //             created_by: createdBy,
    //         };
    //         // const sale = await this.saleModel.create(
    //         //     saleData,
    //         //     { transaction, raw: true },
    //         // ).toString();
    //         const [sale] = await this.sequelize.query(
    //             `
    // INSERT INTO sales (
    //     company_id,
    //     outlet_id,
    //     invoice_no,
    //     sale_date,
    //     subtotal,
    //     discount_amount,
    //     tax_amount,
    //     total_amount,
    //     payment_method,
    //     created_by,
    //     "createdAt",
    //     "updatedAt"
    // )
    // VALUES (
    //     :company_id,
    //     :outlet_id,
    //     :invoice_no,
    //     :sale_date,
    //     :subtotal,
    //     :discount_amount,
    //     :tax_amount,
    //     :total_amount,
    //     :payment_method,
    //     :created_by,
    //     NOW(),
    //     NOW()
    // )
    // RETURNING *;
    // `,
    //             {
    //                 replacements: saleData,
    //                 type: QueryTypes.INSERT,
    //                 transaction,
    //             },
    //         ).toString();

    //         console.log({ sale })
    //         return
    //         // ------------------------------------
    //         // 4. DEDUCT INVENTORY
    //         // ------------------------------------

    //         for (const item of preparedItems) {
    //             const inventory = item.inventory;

    //             const newQuantity =
    //                 Number(inventory.quantity) - item.quantity;

    //             await inventory.update(
    //                 {
    //                     quantity: Number(newQuantity.toFixed(3)),
    //                 },
    //                 { transaction },
    //             );

    //             // ------------------------------------
    //             // 5. CREATE INVENTORY TRANSACTION
    //             // ------------------------------------

    //             // await this.inventoryTransactionModel.create(
    //             //     {
    //             //         outlet_id,
    //             //         inventory_item_id: item.inventory_item_id,
    //             //         transaction_type: InventoryTransactionType.OUT,
    //             //         quantity: item.quantity,
    //             //         reference_id: sale?.id,
    //             //         created_by: createdBy,
    //             //     },
    //             //     { transaction },
    //             // );
    //         }

    //         // ------------------------------------
    //         // 6. CREATE SALE ITEMS
    //         // ------------------------------------

    //         // const saleItems = preparedItems.map((item) => ({
    //         //     sale_id: sale.id,
    //         //     menu_item_id: item.menu_item_id,
    //         //     item_name: item.item_name,
    //         //     quantity: item.quantity,
    //         //     unit_price: item.unit_price,
    //         //     discount: item.discount,
    //         //     total_price: item.total_price,
    //         // }));

    //         // await this.saleItemModel.bulkCreate(
    //         //     saleItems,
    //         //     { transaction },
    //         // );

    //         // ------------------------------------
    //         // 7. COMMIT
    //         // ------------------------------------

    //         // await transaction.commit();

    //         // return this.saleModel.findByPk(sale.id, {
    //         //     include: [
    //         //         {
    //         //             model: SaleItem,
    //         //             as: 'sale_items',
    //         //         },
    //         //     ],
    //         // });

    //     } catch (error) {
    //         if (!transaction) {
    //             await transaction.rollback();
    //         }

    //         throw error;
    //     }
    // }

    // ------------------------------------
    // GENERATE INVOICE NUMBER
    // ------------------------------------


    // async create(createSalesDto: CreateSalesDto, user: any) {
    //     const transaction = await this.sequelize.transaction();

    //     try {
    //         const {
    //             outlet_id,
    //             sale_date,
    //             payment_method,
    //             discount = 0,
    //             items,
    //         } = createSalesDto;

    //         if (!items?.length) {
    //             throw new BadRequestException(
    //                 'At least one sale item is required',
    //             );
    //         }

    //         const menuIds = items.map(item => item.menu_item_id);

    //         if (new Set(menuIds).size !== menuIds.length) {
    //             throw new BadRequestException(
    //                 'Duplicate menu items are not allowed',
    //             );
    //         }

    //         const menuItems = await this.outletMenuModel.findAll({
    //             where: {
    //                 outlet_id,
    //                 menu_item_id: menuIds,
    //                 is_available: true,
    //             },
    //             include: [
    //                 {
    //                     model: MenuItem,
    //                     as: 'menu_item',
    //                 },
    //             ],
    //             transaction,
    //         });

    //         if (menuItems.length !== menuIds.length) {
    //             throw new BadRequestException(
    //                 'Some menu items are not assigned to this outlet',
    //             );
    //         }

    //         let subtotal = 0;

    //         const saleItems = items.map(item => {
    //             const outletMenu = menuItems.find(
    //                 menu =>
    //                     Number(menu.menu_item_id) ===
    //                     Number(item.menu_item_id),
    //             );

    //             const unitPrice = Number(outletMenu.selling_price);
    //             const quantity = Number(item.quantity);

    //             if (!Number.isFinite(quantity) || quantity <= 0) {
    //                 throw new BadRequestException(
    //                     'Invalid item quantity',
    //                 );
    //             }

    //             const totalAmount = unitPrice * quantity;

    //             subtotal += totalAmount;

    //             return {
    //                 menu_item_id: item.menu_item_id,
    //                 item_name: outletMenu.menu_item.name,
    //                 quantity,
    //                 unit_price: unitPrice,
    //                 discount_amount: 0,
    //                 tax_amount: 0,
    //                 total_amount: totalAmount,
    //             };
    //         });

    //         if (Number(discount) < 0 || Number(discount) > subtotal) {
    //             throw new BadRequestException(
    //                 'Invalid discount amount',
    //             );
    //         }

    //         const totalAmount = subtotal - Number(discount);

    //         const saleData = {
    //             // id: 1,
    //             company_id: COMPANY_ID,
    //             outlet_id: Number(outlet_id),
    //             invoice_no: await this.generateInvoiceNo(outlet_id),
    //             sale_date: new Date(sale_date) || new Date(),
    //             subtotal: Number(subtotal.toFixed(2)),
    //             discount_amount: Number(discount.toFixed(2)),
    //             tax_amount: 0,
    //             total_amount: Number(totalAmount.toFixed(2)),
    //             payment_method,
    //             created_by: user.id,
    //         };
    //         // console.log({ totalAmount });
    //         // console.log({ user });
    //         // console.log({ saleItems });
    //         // // return

    //         // console.log({ saleData })
    //         // return

    //         //Insert sale data
    //         const sale = await this.saleModel.create(saleData, {
    //             transaction,
    //         });

    //         await this.saleItemModel.bulkCreate(
    //             saleItems.map(item => ({
    //                 ...item,
    //                 sale_id: sale.id,
    //             })),
    //             { transaction },
    //         );
    //         // deduct from inventory
    //         await transaction.commit();

    //         return this.saleModel.findByPk(sale.id, {
    //             include: [
    //                 {
    //                     model: SaleItem,
    //                     as: 'sale_items',
    //                 },
    //             ],
    //         });

    //     } catch (error) {
    //         await transaction.rollback();
    //         throw error;
    //     }
    // }
    async create(createSalesDto: CreateSalesDto, user: any) {
        const transaction = await this.sequelize.transaction();

        try {
            const {
                outlet_id,
                sale_date,
                payment_method,
                discount = 0,
                items,
            } = createSalesDto;

            if (!items?.length) {
                throw new BadRequestException(
                    'At least one sale item is required',
                );
            }

            // Validate duplicate menu items
            const menuIds = items.map(item => Number(item.menu_item_id));

            if (new Set(menuIds).size !== menuIds.length) {
                throw new BadRequestException(
                    'Duplicate menu items are not allowed',
                );
            }

            // Validate outlet menu items
            const menuItems = await this.outletMenuModel.findAll({
                where: {
                    outlet_id,
                    menu_item_id: menuIds,
                    is_available: true,
                },
                include: [
                    {
                        model: MenuItem,
                        as: 'menu_item',
                    },
                ],
                transaction,
            });

            if (menuItems.length !== menuIds.length) {
                throw new BadRequestException(
                    'Some menu items are not assigned to this outlet or unavailable',
                );
            }

            // Fetch and lock inventory records
            const inventories = await this.inventoryModel.findAll({
                where: {
                    company_id: COMPANY_ID,
                    outlet_id,
                    menu_item_id: menuIds,
                    is_active: true,
                },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            // if (inventories.length !== menuIds.length) {
            //     throw new BadRequestException(
            //         'Inventory mapping not found for some menu items',
            //     );
            // }

            let subtotal = 0;

            const saleItems = [];
            const stockUpdates = [];

            // Validate stock and calculate sale items
            for (const item of items) {
                const menuId = Number(item.menu_item_id);

                const outletMenu = menuItems.find(
                    menu =>
                        Number(menu.menu_item_id) === menuId,
                );

                const inventory = inventories.find(
                    stock =>
                        Number(stock.menu_item_id) === menuId,
                );

                if (!inventory) {
                    throw new BadRequestException(
                        `Inventory not found for menu item ${menuId}`,
                    );
                }

                const unitPrice = Number(outletMenu.selling_price);
                const requestedQty = Number(item.quantity);

                if (
                    !Number.isFinite(requestedQty) ||
                    requestedQty <= 0
                ) {
                    throw new BadRequestException(
                        `Invalid quantity for ${outletMenu.menu_item.name}`,
                    );
                }

                const currentStock = Number(inventory.quantity);
                const reservedStock = Number(
                    inventory.reserved_quantity || 0,
                );

                const availableStock = currentStock - reservedStock;

                // Stock validation
                if (requestedQty > availableStock) {
                    throw new BadRequestException(
                        `Insufficient stock for ${outletMenu.menu_item.name}. Available: ${availableStock}, Requested: ${requestedQty}`,
                    );
                }

                const remainingStock = currentStock - requestedQty;

                const totalAmount = unitPrice * requestedQty;

                subtotal += totalAmount;

                saleItems.push({
                    menu_item_id: menuId,
                    item_name: outletMenu.menu_item.name,
                    quantity: requestedQty,
                    unit_price: unitPrice,
                    discount_amount: 0,
                    tax_amount: 0,
                    total_amount: Number(totalAmount.toFixed(2)),
                });

                stockUpdates.push({
                    inventory,
                    remainingStock,
                    requestedQty,
                });
            }

            // Validate discount
            const discountAmount = Number(discount);

            if (
                !Number.isFinite(discountAmount) ||
                discountAmount < 0 ||
                discountAmount > subtotal
            ) {
                throw new BadRequestException(
                    'Invalid discount amount',
                );
            }

            const totalAmount = subtotal - discountAmount;

            // Create sale
            const saleData = {
                company_id: COMPANY_ID,
                outlet_id: Number(outlet_id),
                invoice_no: await this.generateInvoiceNo(outlet_id),
                sale_date: sale_date
                    ? new Date(sale_date)
                    : new Date(),
                subtotal: Number(subtotal.toFixed(2)),
                discount_amount: Number(discountAmount.toFixed(2)),
                tax_amount: 0,
                total_amount: Number(totalAmount.toFixed(2)),
                payment_method,
                created_by: user.id,
            };

            const sale = await this.saleModel.create(
                saleData,
                { transaction },
            );

            // Insert sale items
            await this.saleItemModel.bulkCreate(
                saleItems.map(item => ({
                    ...item,
                    sale_id: sale.id,
                })),
                { transaction },
            );

            // Deduct inventory stock
            for (const stock of stockUpdates) {
                await stock.inventory.update(
                    {
                        quantity: stock.remainingStock,
                    },
                    { transaction },
                );
                // ------------------------------------
                // 5. CREATE INVENTORY TRANSACTION
                // ------------------------------------
                // await this.sequelize.query(
                //     `
                // INSERT INTO inventory_transactions (
                // company_id
                //     outlet_id,

                //     inventory_item_id,
                //     transaction_type,
                //     quantity,
                //     reference_id,
                //     created_by,
                //     "createdAt",
                // )
                // VALUES (
                // COMPANY_ID,
                //     :outlet_id,
                //     :inventory_item_id,
                //     :transaction_type,
                //     :quantity,
                //     :reference_id,
                //     :created_by,
                //     NOW(),
                // )
                // `,
                //     {
                //         replacements: {
                //             company_id: COMPANY_ID,
                //             outlet_id: Number(outlet_id),
                //             inventory_item_id: Number(stock.inventory.inventory_item_id),
                //             transaction_type: InventoryTransactionType.OUT,
                //             quantity: Number(stock.requestedQty),
                //             reference_id: Number(sale.id),
                //             created_by: Number(user.id),
                //         },
                //         transaction,
                //         type: QueryTypes.INSERT,
                //     },
                // ).toString();

                await this.inventoryTransactionModel.create(
                    {
                        company_id: COMPANY_ID,
                        outlet_id: Number(outlet_id),
                        inventory_item_id: Number(stock.inventory.inventory_item_id),
                        transaction_type: InventoryTransactionType.OUT,
                        quantity: Number(stock.requestedQty),
                        reference_id: Number(sale.id),
                        created_by: Number(user.id),
                    },
                    { transaction },
                );
            }

            // Commit everything together
            await transaction.commit();

            return await this.saleModel.findByPk(sale.id, {
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

    private async generateInvoiceNo(outlet_id: number): Promise<string> {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        const lastSale = await this.saleModel.findOne({
            where: { outlet_id },
            order: [['id', 'DESC']],
        });

        const nextNumber = lastSale ? lastSale.id + 1 : 1;

        return `INV-${outlet_id}-${year}${month}-${String(nextNumber).padStart(5, '0')}`;
    }

}

// import {
//     Injectable, NotFoundException, BadRequestException,
//     ConflictException,
// } from '@nestjs/common';
// import { InjectModel, InjectConnection } from '@nestjs/sequelize';
// import { Op, Sequelize, fn, col, literal, QueryTypes } from 'sequelize';
// import { SaleItem } from '../../models/sales_items.model';
// import { Sale } from '../../models/sales.model';
// import { OutletMenu } from '@/models/outlet_menu.model';
// import { CreateSalesDto } from './dto/create-sales.dto';
// import { Outlet } from '@/models/outlet.model';
// import { MenuItem } from '@/models/menu_items.model';
// import { COMPANY_ID } from '@/common/constants';


// @Injectable()
// export class SalesService {
//     constructor(
//         @InjectModel(Sale)
//         private readonly saleModel: typeof Sale,
//         @InjectModel(SaleItem)
//         private readonly saleItemModel: typeof SaleItem,
//         @InjectModel(OutletMenu)
//         private readonly outletMenuModel: typeof OutletMenu,
//         @InjectModel(Outlet)
//         private readonly outletModel: typeof Outlet,

//         @InjectConnection()
//         private readonly sequelize: Sequelize,
//     ) { }

//     // async create(createSalesDto: CreateSalesDto) {
//     //     const transaction = await this.sequelize.transaction();

//     //     try {
//     //         const {
//     //             outlet_id,
//     //             payment_method,
//     //             discount = 0,
//     //             items,
//     //         } = createSalesDto;

//     //         // Validate items
//     //         if (!items?.length) {
//     //             throw new BadRequestException(
//     //                 'At least one sale item is required',
//     //             );
//     //         }

//     //         // Find assigned menu items for this outlet
//     //         const menuItems = await this.outletMenuModel.findAll({
//     //             where: {
//     //                 outlet_id,
//     //                 menu_item_id: items.map(item => item.menu_item_id),
//     //                 is_available: true,
//     //             },
//     //             transaction,
//     //         });

//     //         if (menuItems.length !== new Set(
//     //             items.map(item => item.menu_item_id),
//     //         ).size) {
//     //             throw new BadRequestException(
//     //                 'Some menu items are not assigned to this outlet',
//     //             );
//     //         }

//     //         // Calculate subtotal using outlet prices
//     //         let subtotal = 0;

//     //         const saleItems = items.map(item => {
//     //             const outletMenu = menuItems.find(
//     //                 menu => menu.menu_item_id === item.menu_item_id,
//     //             );

//     //             const unitPrice = Number(outletMenu.selling_price);
//     //             const totalPrice = unitPrice * item.quantity;

//     //             subtotal += totalPrice;

//     //             return {
//     //                 menu_item_id: item.menu_item_id,
//     //                 quantity: item.quantity,
//     //                 unit_price: unitPrice,
//     //                 total_price: totalPrice,
//     //             };
//     //         });

//     //         if (discount > subtotal) {
//     //             throw new BadRequestException(
//     //                 'Discount cannot exceed subtotal',
//     //             );
//     //         }

//     //         const totalAmount = subtotal - discount;

//     //         // Create sale
//     //         const sale = await this.saleModel.create(
//     //             {
//     //                 outlet_id,
//     //                 subtotal,
//     //                 discount_amount: discount,
//     //                 total_amount: totalAmount,
//     //                 payment_method,
//     //             },
//     //             { transaction },
//     //         );

//     //         // Create sale items
//     //         await this.saleItemModel.bulkCreate(
//     //             saleItems.map(item => ({
//     //                 ...item,
//     //                 sale_id: sale.id,
//     //             })),
//     //             { transaction },
//     //         );

//     //         await transaction.commit();

//     //         return this.saleModel.findByPk(sale.id, {
//     //             include: [
//     //                 {
//     //                     model: SaleItem,
//     //                     as: 'sale_items',
//     //                 },
//     //             ],
//     //         });

//     //     } catch (error) {
//     //         await transaction.rollback();
//     //         throw error;
//     //     }
//     // }
//     async create(createSalesDto: CreateSalesDto, user: any) {
//         const transaction = await this.sequelize.transaction();

//         try {
//             const {
//                 outlet_id,
//                 sale_date,
//                 payment_method,
//                 discount = 0,
//                 items,
//             } = createSalesDto;

//             if (!items?.length) {
//                 throw new BadRequestException(
//                     'At least one sale item is required',
//                 );
//             }

//             const menuIds = items.map(item => item.menu_item_id);

//             if (new Set(menuIds).size !== menuIds.length) {
//                 throw new BadRequestException(
//                     'Duplicate menu items are not allowed',
//                 );
//             }

//             const menuItems = await this.outletMenuModel.findAll({
//                 where: {
//                     outlet_id,
//                     menu_item_id: menuIds,
//                     is_available: true,
//                 },
//                 include: [
//                     {
//                         model: MenuItem,
//                         as: 'menu_item',
//                     },
//                 ],
//                 transaction,
//             });

//             if (menuItems.length !== menuIds.length) {
//                 throw new BadRequestException(
//                     'Some menu items are not assigned to this outlet',
//                 );
//             }

//             let subtotal = 0;

//             const saleItems = items.map(item => {
//                 const outletMenu = menuItems.find(
//                     menu =>
//                         Number(menu.menu_item_id) ===
//                         Number(item.menu_item_id),
//                 );

//                 const unitPrice = Number(outletMenu.selling_price);
//                 const quantity = Number(item.quantity);

//                 if (!Number.isFinite(quantity) || quantity <= 0) {
//                     throw new BadRequestException(
//                         'Invalid item quantity',
//                     );
//                 }

//                 const totalAmount = unitPrice * quantity;

//                 subtotal += totalAmount;

//                 return {
//                     menu_item_id: item.menu_item_id,
//                     item_name: outletMenu.menu_item.name,
//                     quantity,
//                     unit_price: unitPrice,
//                     discount_amount: 0,
//                     tax_amount: 0,
//                     total_amount: totalAmount,
//                 };
//             });

//             if (Number(discount) < 0 || Number(discount) > subtotal) {
//                 throw new BadRequestException(
//                     'Invalid discount amount',
//                 );
//             }

//             const totalAmount = subtotal - Number(discount);

//             const saleData = {
//                 // id: 1,
//                 company_id: COMPANY_ID,
//                 outlet_id: Number(outlet_id),
//                 invoice_no: await this.generateInvoiceNo(outlet_id),
//                 sale_date: new Date(sale_date) || new Date(),
//                 subtotal: Number(subtotal.toFixed(2)),
//                 discount_amount: Number(discount.toFixed(2)),
//                 tax_amount: 0,
//                 total_amount: Number(totalAmount.toFixed(2)),
//                 payment_method,
//                 created_by: user.id,
//             };
//             // console.log({ totalAmount });
//             // console.log({ user });
//             // console.log({ saleItems });
//             // // return

//             // console.log({ saleData })
//             // return

//             //Insert sale data
//             const sale = await this.saleModel.create(saleData, {
//                 transaction,
//             });

//             await this.saleItemModel.bulkCreate(
//                 saleItems.map(item => ({
//                     ...item,
//                     sale_id: sale.id,
//                 })),
//                 { transaction },
//             );
//             // deduct from inventory
//             await transaction.commit();

//             return this.saleModel.findByPk(sale.id, {
//                 include: [
//                     {
//                         model: SaleItem,
//                         as: 'sale_items',
//                     },
//                 ],
//             });

//         } catch (error) {
//             await transaction.rollback();
//             throw error;
//         }
//     }
// }







