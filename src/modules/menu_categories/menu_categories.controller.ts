import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { MenuCategoriesService } from './menu_categories.service';
import { CreateMenuCategoriesDto } from './dto/create-menu_categories.dto';
import { UpdateMenuCategoriesDto } from './dto/update-menu_categories.dto';

@Controller('menu-categories')
export class MenuCategoriesController {
    constructor(private readonly menuCategoriesService: MenuCategoriesService) { }

    @Post()
    create(@Body() createMenuCategoriesDto: CreateMenuCategoriesDto) {
        return this.menuCategoriesService.create(createMenuCategoriesDto);
    }

    @Get()
    findAll() {
        return this.menuCategoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.menuCategoriesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMenuCategoriesDto: UpdateMenuCategoriesDto) {
        return this.menuCategoriesService.update(+id, updateMenuCategoriesDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.menuCategoriesService.remove(+id);
    }
}
