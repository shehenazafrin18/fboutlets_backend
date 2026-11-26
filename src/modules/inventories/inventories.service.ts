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
import { Outlet } from '@/models/outlet.model';
import { InventoryItem } from '@/models/inventory_items.model';
import { OutletMenu } from '@/models/outlet_menu.model';
import { MenuRecipe } from '@/models/menu_recipe.model';
import { MenuItem } from '@/models/menu_items.model';

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
            company_id: COMPANY_ID,
        });
    }

    public async findAll() {
        // const result = await this.inventoryModel.findAll({
        //     include: [
        //         {
        //             model: Outlet,
        //             as: 'outlet',
        //             attributes: ['id', 'name'],
        //         },
        //         {
        //             model: InventoryItem,
        //             as: 'inventory_item',
        //             attributes: ['id', 'name', 'sku'],
        //             include: [
        //                 {
        //                     model: MenuRecipe,
        //                     as: 'menu_recipes',
        //                     attributes: [
        //                         'id',
        //                         'menu_item_id',
        //                         'inventory_item_id',
        //                         'quantity'
        //                     ],
        //                     required: false,
        //                     include: [
        //                         {
        //                             model: MenuItem,
        //                             as: 'menu_item',
        //                             attributes: ['id', 'name', 'category_id']
        //                         }
        //                     ],
        //                 }
        //             ],
        //         },
        //     ],
        //     order: [['createdAt', 'DESC']],
        // });
        const result = this.inventoryModel.findAll({
            attributes: [
                'id',
                'outlet_id',
                'inventory_item_id',
                'quantity',
            ],
            include: [
                {
                    model: Outlet,
                    as: 'outlet',
                    attributes: ['id', 'name'],
                    required: false,
                },
                {
                    model: InventoryItem,
                    as: 'inventory_item',
                    attributes: ['id', 'name'],
                    required: false,
                },
                {
                    model: OutletMenu,
                    as: 'outlet_menus',
                    attributes: [
                        'selling_price',
                        'menu_item_id',
                    ],
                    required: false,
                    include: [
                        {
                            model: MenuItem,
                            as: 'menu_item',
                            attributes: ['id', 'name'],
                            required: false,
                        }
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return result;
        // return result.map(item => item.get({ plain: true }));


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

        await inventory.update({
            ...updateInventoriesDto,
            company_id: COMPANY_ID,
        });

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