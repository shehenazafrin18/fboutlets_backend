import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateMenuItemsDto } from './dto/create-menu_items.dto';
import { UpdateMenuItemsDto } from './dto/update-menu_items.dto';
import { MenuItemsService } from './menu_items.service';


@Controller('menu-items')
export class MenuItemsController {
    constructor(private readonly menuItemsService: MenuItemsService) { }

    @Post()
    create(@Body() createMenuItemsDto: CreateMenuItemsDto) {
        return this.menuItemsService.create(createMenuItemsDto);
    }

    @Get()
    findAll() {
        return this.menuItemsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.menuItemsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMenuItemsDto: UpdateMenuItemsDto) {
        return this.menuItemsService.update(+id, updateMenuItemsDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.menuItemsService.remove(+id);
    }
}
