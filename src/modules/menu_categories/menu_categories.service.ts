import { Injectable } from '@nestjs/common';
import { CreateMenuCategoriesDto } from './dto/create-menu_categories.dto';
import { UpdateMenuCategoriesDto } from './dto/update-menu_categories.dto';


@Injectable()
export class MenuCategoriesService {
    public async create(createMenuCategoriesDto: CreateMenuCategoriesDto) {
        return 'This action adds a new Menu Category';
    }

    public async findAll() {
        return `This action returns all Menu Categories`;
    }

    public async findOne(id: number) {
        return `This action returns a #${id} Menu Category`;
    }

    public async update(id: number, updateMenuCategoriesDto: UpdateMenuCategoriesDto) {
        return `This action updates a #${id} Menu Category`;
    }

    public async remove(id: number) {
        return `This action removes a #${id} Menu Category`;
    }
}
