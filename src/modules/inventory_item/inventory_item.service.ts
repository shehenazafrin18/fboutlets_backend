import {
    Injectable, NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { CreateInventoryItemDto } from './dto/create-inventory_item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory_item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { COMPANY_ID } from '@/common/constants';
import { InventoryItem } from '@/models/inventory_items.model';

@Injectable()
export class InventoryItemService {
    constructor(
        @InjectModel(InventoryItem)
        private readonly inventoryItemModel: typeof InventoryItem,
    ) { }

    public async create(createInventoriesDto: CreateInventoryItemDto) {
        const existing = await this.inventoryItemModel.findOne({
            where: {
                company_id: COMPANY_ID,
                name: createInventoriesDto.name,
            },
        });
        console.log({ existing });
        if (existing) {
            throw new ConflictException(
                'Inventory item already exists',
            );
        }

        const result = this.inventoryItemModel.create({
            ...createInventoriesDto,
            company_id: COMPANY_ID,
            standard_cost: String(createInventoriesDto.standard_cost),
        });
    }

    public async findAll() {
        return this.inventoryItemModel.findAll({
            order: [['createdAt', 'DESC']],
        });
    }

    public async findOne(id: number) {
        const inventory = await this.inventoryItemModel.findByPk(id);

        if (!inventory) {
            throw new NotFoundException('Inventory item not found');
        }

        return inventory;
    }

    public async update(
        id: number,
        updateInventoriesDto: UpdateInventoryItemDto,
    ) {
        const inventory = await this.inventoryItemModel.findByPk(id);

        if (!inventory) {
            throw new NotFoundException('Inventory item not found');
        }

        if (

            updateInventoriesDto.name
        ) {
            const companyId = COMPANY_ID ?? inventory.company_id;

            const name =
                updateInventoriesDto.name ?? inventory.name;



            const existing = await this.inventoryItemModel.findOne({
                where: {
                    company_id: companyId,
                    name: name,
                    id: { [Op.ne]: id },
                },
            });

            if (existing) {
                throw new ConflictException(
                    'Inventory item already exists',
                );
            }
        }

        const result = await inventory.update({
            ...updateInventoriesDto,
            company_id: COMPANY_ID,
            standard_cost: String(updateInventoriesDto.standard_cost),
        }).toString();
        console.log({ result });
        return inventory;
    }

    public async remove(id: number) {
        const inventory = await this.inventoryItemModel.findByPk(id);

        if (!inventory) {
            throw new NotFoundException('Inventory item not found');
        }

        await inventory.destroy();

        return {
            message: 'Inventory item deleted successfully',
        };
    }
}