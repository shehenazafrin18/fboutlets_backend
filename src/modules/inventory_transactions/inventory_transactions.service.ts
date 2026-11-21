// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class InventoryTransactionsService {
//     public async create(createMenuCategoriesDto: CreateMenuCategoriesDto) {
//         return 'This action adds a new Menu Category';
//     }

//     public async findAll() {
//         return `This action returns all Menu Categories`;
//     }

//     public async findOne(id: number) {
//         return `This action returns a #${id} Menu Category`;
//     }

//     public async update(id: number, updateMenuCategoriesDto: UpdateMenuCategoriesDto) {
//         return `This action updates a #${id} Menu Category`;
//     }

//     public async remove(id: number) {
//         return `This action removes a #${id} Menu Category`;
//     }
// }
import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { InventoryTransaction } from '../../models/inventory_transactions.model';
import { InventoryItem } from '../../models/inventory_items.model';
import { Outlet } from '../../models/outlet.model';
import { Company } from '../../models/company.model';

import { CreateInventoryTransactionsDto } from './dto/create-inventory_transactions.dto';

@Injectable()
export class InventoryTransactionsService {
    constructor(
        @InjectModel(InventoryTransaction)
        private readonly inventoryTransactionModel: typeof InventoryTransaction,

        @InjectModel(InventoryItem)
        private readonly inventoryItemModel: typeof InventoryItem,

        @InjectModel(Outlet)
        private readonly outletModel: typeof Outlet,

        @InjectModel(Company)
        private readonly companyModel: typeof Company,
    ) { }

    // POST /inventory-transactions
    public async create(
        createInventoryTransactionsDto: CreateInventoryTransactionsDto,
    ) {
        const {
            company_id,
            outlet_id,
            inventory_item_id,
        } = createInventoryTransactionsDto;

        const [company, outlet, inventoryItem] = await Promise.all([
            this.companyModel.findByPk(company_id),
            this.outletModel.findByPk(outlet_id),
            this.inventoryItemModel.findByPk(inventory_item_id),
        ]);

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        if (!outlet) {
            throw new NotFoundException('Outlet not found');
        }

        if (!inventoryItem) {
            throw new NotFoundException('Inventory item not found');
        }

        return this.inventoryTransactionModel.create(
            createInventoryTransactionsDto as any,
        );
    }

    // GET /inventory-transactions
    public async findAll(query: any) {
        const {
            company_id,
            outlet_id,
            inventory_item_id,
            type,
            page = 1,
            limit = 10,
        } = query;

        const where: any = {};

        if (company_id) where.company_id = company_id;
        if (outlet_id) where.outlet_id = outlet_id;

        if (inventory_item_id) {
            where.inventory_item_id = inventory_item_id;
        }

        if (type) where.type = type;

        const offset = (Number(page) - 1) * Number(limit);

        const { rows, count } =
            await this.inventoryTransactionModel.findAndCountAll({
                where,
                include: [
                    {
                        model: InventoryItem,
                    },
                ],
                limit: Number(limit),
                offset,
                order: [['createdAt', 'DESC']],
                distinct: true,
            });

        return {
            data: rows,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / Number(limit)),
            },
        };
    }

    // GET /inventory-transactions/:id
    public async findOne(id: number) {
        const transaction = await this.inventoryTransactionModel.findByPk(id);

        if (!transaction) {
            throw new NotFoundException(
                'Inventory transaction not found',
            );
        }

        return transaction;
    }

    // GET /inventory-transactions/:id/details
    public async findDetails(id: number) {
        const transaction =
            await this.inventoryTransactionModel.findByPk(id, {
                include: [
                    {
                        model: Company,
                    },
                    {
                        model: Outlet,
                    },
                    {
                        model: InventoryItem,
                    },
                ],
            });

        if (!transaction) {
            throw new NotFoundException(
                'Inventory transaction not found',
            );
        }

        return transaction;
    }
}