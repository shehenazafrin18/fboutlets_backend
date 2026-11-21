// import { Injectable } from '@nestjs/common';
// import { CreateOutletMenuDto } from './dto/create-outlet_menu.dto';
// import { UpdateOutletMenuDto } from './dto/update-outlet_menu.dto';


// @Injectable()
// export class OutletMenuService {
//     public async create(createOutletMenuDto: CreateOutletMenuDto) {
//         return 'This action adds a new Outlet Menu';
//     }

//     public async findAll() {
//         return `This action returns all Outlet Menus`;
//     }

//     public async findOne(id: number) {
//         return `This action returns a #${id} Outlet Menu`;
//     }

//     public async update(id: number, updateOutletMenuDto: UpdateOutletMenuDto) {
//         return `This action updates a #${id} Outlet Menu`;
//     }

//     public async remove(id: number) {
//         return `This action removes a #${id} Outlet Menu`;
//     }
// }

import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { CreateOutletMenuDto } from './dto/create-outlet_menu.dto';
import { UpdateOutletMenuDto } from './dto/update-outlet_menu.dto';

import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { OutletMenu } from '../../models/outlet_menu.model';
import { Outlet } from '../../models/outlet.model';
import { MenuItem } from '../../models/menu_items.model';

@Injectable()
export class OutletMenuService {
    constructor(
        @InjectModel(OutletMenu)
        private readonly outletMenuModel: typeof OutletMenu,

        @InjectModel(Outlet)
        private readonly outletModel: typeof Outlet,

        @InjectModel(MenuItem)
        private readonly menuItemModel: typeof MenuItem,
    ) { }

    // GET /outlets/:outletId/menu
    public async findOutletMenu(outletId: string) {
        const outlet = await this.outletModel.findByPk(outletId);

        if (!outlet) {
            throw new NotFoundException('Outlet not found');
        }

        return this.outletMenuModel.findAll({
            where: { outlet_id: outletId },
            include: [
                {
                    model: MenuItem,
                    required: true,
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }

    // POST /outlets/:outletId/menu-items/:itemId/assign
    public async assignMenuItem(
        outletId: string,
        itemId: string,
    ) {
        const [outlet, menuItem] = await Promise.all([
            this.outletModel.findByPk(outletId),
            this.menuItemModel.findByPk(itemId),
        ]);

        if (!outlet) {
            throw new NotFoundException('Outlet not found');
        }

        if (!menuItem) {
            throw new NotFoundException('Menu item not found');
        }

        const existing = await this.outletMenuModel.findOne({
            where: {
                outlet_id: outletId,
                menu_item_id: itemId,
            },
        });

        if (existing) {
            throw new ConflictException(
                'Menu item is already assigned to this outlet',
            );
        }

        return this.outletMenuModel.create({
            outlet_id: outletId,
            menu_item_id: itemId,
            selling_price: menuItem.base_price,
            is_available: true,
        } as any);
    }

    // PATCH /outlets/:outletId/menu-items/:itemId/price
    public async updateMenuItemPrice(
        outletId: string,
        itemId: string,
        base_price: number,
    ) {
        if (base_price < 0) {
            throw new BadRequestException('Price cannot be negative');
        }

        const outletMenu = await this.outletMenuModel.findOne({
            where: {
                outlet_id: outletId,
                menu_item_id: itemId,
            },
        });

        if (!outletMenu) {
            throw new NotFoundException(
                'Menu item is not assigned to this outlet',
            );
        }

        await outletMenu.update({ selling_price: base_price });

        return outletMenu;
    }

    // // POST /outlets/:outletId/menu-items/bulk-assign
    // public async bulkAssignMenuItems(
    //     outletId: string,
    //     itemIds: string[],
    // ) {
    //     if (!itemIds || itemIds.length === 0) {
    //         throw new BadRequestException(
    //             'At least one menu item is required',
    //         );
    //     }

    //     const outlet = await this.outletModel.findByPk(outletId);

    //     if (!outlet) {
    //         throw new NotFoundException('Outlet not found');
    //     }

    //     const uniqueItemIds = [...new Set(itemIds)];

    //     const menuItems = await this.menuItemModel.findAll({
    //         where: {
    //             id: {
    //                 [Op.in]: uniqueItemIds,
    //             },
    //         },
    //     });

    //     if (menuItems.length !== uniqueItemIds.length) {
    //         throw new NotFoundException(
    //             'One or more menu items do not exist',
    //         );
    //     }

    //     const existingItems = await this.outletMenuModel.findAll({
    //         where: {
    //             outlet_id: outletId,
    //             menu_item_id: {
    //                 [Op.in]: uniqueItemIds,
    //             },
    //         },
    //         attributes: ['menu_item_id'],
    //     });

    //     const existingIds = new Set(
    //         existingItems.map((item) => String(item.menu_item_id)),
    //     );

    //     const newItems = menuItems
    //         .filter((item) => !existingIds.has(String(item.id)))
    //         .map((item) => ({
    //             outlet_id: outletId,
    //             menu_item_id: item.id,
    //             selling_price: item.base_price,
    //             is_available: true,
    //         }));

    //     if (newItems.length === 0) {
    //         return {
    //             message: 'All menu items are already assigned',
    //             assigned: 0,
    //         };
    //     }

    //     await this.outletMenuModel.bulkCreate(newItems);

    //     return {
    //         message: 'Menu items assigned successfully',
    //         assigned: newItems.length,
    //         skipped: existingIds.size,
    //     };
    // }
}
