import {
    Injectable, NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateMenuItemsDto } from './dto/create-menu_items.dto';
import { UpdateMenuItemsDto } from './dto/update-menu_items.dto';
import { MenuItem } from '@/models/menu_items.model';

@Injectable()
export class MenuItemsService {
    constructor(
        @InjectModel(MenuItem)
        private readonly menuItemModel: typeof MenuItem,
    ) { }
    public async create(createMenuItemsDto: CreateMenuItemsDto) {

        const existing = await this.menuItemModel.findOne({
            where: {
                company_id: createMenuItemsDto.company_id,
                category_id: createMenuItemsDto.category_id,
                name: createMenuItemsDto.name,
            },
        });

        if (existing) {
            throw new ConflictException(
                'Menu Item already exists for this company and category',
            );
        }

        return this.menuItemModel.create({
            ...createMenuItemsDto,
        });
    }

    public async findAll() {
        return this.menuItemModel.findAll({
            order: [['createdAt', 'DESC']],
        });
    }

    public async findOne(id: number) {
        const menuItem = await this.menuItemModel.findByPk(id);

        if (!menuItem) {
            throw new NotFoundException('Menu Item not found');
        }

        return menuItem;
    }

    public async update(id: number, updateMenuItemsDto: UpdateMenuItemsDto) {
        const menuItem = await this.menuItemModel.findByPk(id);

        if (!menuItem) {
            throw new NotFoundException('Menu Item not found');
        }

        if (
            updateMenuItemsDto.company_id ||
            updateMenuItemsDto.category_id ||
            updateMenuItemsDto.name
        ) {
            const companyId =
                updateMenuItemsDto.company_id ?? menuItem.company_id;

            const categoryId =
                updateMenuItemsDto.category_id ?? menuItem.category_id;

            const name =
                updateMenuItemsDto.name ?? menuItem.name;
            updateMenuItemsDto.base_price ??
                menuItem.base_price;

            const existing = await this.menuItemModel.findOne({
                where: {
                    company_id: companyId,
                    category_id: categoryId,
                    name: name,
                    id: { [Op.ne]: id },
                },
            });

            if (existing) {
                throw new ConflictException(
                    'Menu Item already exists for this company and category',
                );
            }
        }
        await menuItem.update(updateMenuItemsDto);

        return menuItem;
    }

    public async remove(id: number) {
        const menuItem = await this.menuItemModel.findByPk(id);

        if (!menuItem) {
            throw new NotFoundException('Menu Item not found');
        }

        await menuItem.destroy();

        return {
            message: 'Menu Item deleted successfully',
        };
    }
}
