import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMenuCategoriesDto } from './dto/create-menu_categories.dto';
import { UpdateMenuCategoriesDto } from './dto/update-menu_categories.dto';
import { MenuCategory } from '@/models/menu_categories.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { COMPANY_ID } from '@/common/constants';

@Injectable()
export class MenuCategoriesService {
    constructor(
        @InjectModel(MenuCategory)
        private readonly menuCategoryModel: typeof MenuCategory,
    ) { }
    public async create(createMenuCategoriesDto: CreateMenuCategoriesDto) {
        const existing = await this.menuCategoryModel.findOne({
            where: {
                company_id: COMPANY_ID,
                name: createMenuCategoriesDto.name,
            },
        });

        if (existing) {
            throw new ConflictException(
                'Menu Category already exists for this company',
            );
        }

        return this.menuCategoryModel.create({
            ...createMenuCategoriesDto,
        });
    }

    public async findAll() {
        return this.menuCategoryModel.findAll({
            order: [['created_at', 'DESC']],
        });
    }

    public async findOne(id: number) {
        const menuCategory = await this.menuCategoryModel.findByPk(id);

        if (!menuCategory) {
            throw new NotFoundException('Menu Category not found');
        }

        return menuCategory;
    }

    public async update(id: number, updateMenuCategoriesDto: UpdateMenuCategoriesDto) {
        const menuCategory = await this.menuCategoryModel.findByPk(id);
        console.log({ updateMenuCategoriesDto })
        if (!menuCategory) {
            throw new NotFoundException('Menu Category not found');
        }

        if (
            // updateMenuCategoriesDto.company_id ||
            updateMenuCategoriesDto.name
        ) {
            const companyId =
                COMPANY_ID ?? menuCategory.company_id;



            const existing = await this.menuCategoryModel.findOne({
                where: {
                    company_id: companyId,
                    id: { [Op.ne]: id },
                },
            });

            if (existing) {
                throw new ConflictException(
                    'Menu Category already exists for this company',
                );
            }
        }

        await menuCategory.update(updateMenuCategoriesDto);

        return menuCategory;
    }

    public async remove(id: number) {
        const menuCategory = await this.menuCategoryModel.findByPk(id);

        if (!menuCategory) {
            throw new NotFoundException('Menu Category not found');
        }

        await menuCategory.destroy();

        return {
            message: 'Menu Category deleted successfully',
        };
    }
}
