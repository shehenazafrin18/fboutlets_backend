import {
    Injectable, NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { CreateInventoriesDto } from './dto/create-inventories.dto';
import { UpdateInventoriesDto } from './dto/update-inventories.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Inventory } from '../../models/inventories.model';
import { COMPANY_ID } from '@/common/constants';

@Injectable()
export class InventoriesService {
    constructor(
        @InjectModel(Inventory)
        private readonly inventoryModel: typeof Inventory,
    ) { }

    public async create(createInventoriesDto: CreateInventoriesDto) {
        const existing = await this.inventoryModel.findOne({
            where: {
                company_id: COMPANY_ID,
                outlet_id: createInventoriesDto.outlet_id,
                inventory_item_id: createInventoriesDto.inventory_item_id,
            },
        });

        if (existing) {
            throw new ConflictException(
                'Inventory already exists for this outlet and item',
            );
        }

        return this.inventoryModel.create({
            ...createInventoriesDto,
        });
    }

    public async findAll() {
        return this.inventoryModel.findAll({
            order: [['createdAt', 'DESC']],
        });
    }

    public async findOne(id: number) {
        const inventory = await this.inventoryModel.findByPk(id);

        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }

        return inventory;
    }

    public async update(
        id: number,
        updateInventoriesDto: UpdateInventoriesDto,
    ) {
        const inventory = await this.inventoryModel.findByPk(id);

        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }

        if (
            // updateInventoriesDto.company_id ||
            updateInventoriesDto.outlet_id ||
            updateInventoriesDto.inventory_item_id
        ) {
            const companyId = COMPANY_ID ?? inventory.company_id;

            const outletId =
                updateInventoriesDto.outlet_id ?? inventory.outlet_id;

            const itemId =
                updateInventoriesDto.inventory_item_id ??
                inventory.inventory_item_id;

            const existing = await this.inventoryModel.findOne({
                where: {
                    company_id: companyId,
                    outlet_id: outletId,
                    inventory_item_id: itemId,
                    id: { [Op.ne]: id },
                },
            });

            if (existing) {
                throw new ConflictException(
                    'Inventory already exists for this outlet and item',
                );
            }
        }

        await inventory.update(updateInventoriesDto);

        return inventory;
    }

    public async remove(id: number) {
        const inventory = await this.inventoryModel.findByPk(id);

        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }

        await inventory.destroy();

        return {
            message: 'Inventory deleted successfully',
        };
    }
}