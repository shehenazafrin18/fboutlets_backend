import { Injectable } from '@nestjs/common';
import { CreateMenuItemsDto } from './dto/create-menu_items.dto';
import { UpdateMenuItemsDto } from './dto/update-menu_items.dto';


@Injectable()
export class MenuItemsService {
    public async create(createMenuItemsDto: CreateMenuItemsDto) {
        return 'This action adds a new Menu Item';
    }

    public async findAll() {
        return `This action returns all Menu Items`;
    }

    public async findOne(id: number) {
        return `This action returns a #${id} Menu Item`;
    }

    public async update(id: number, updateMenuItemsDto: UpdateMenuItemsDto) {
        return `This action updates a #${id} Menu Item`;
    }

    public async remove(id: number) {
        return `This action removes a #${id} Menu Item`;
    }
}
