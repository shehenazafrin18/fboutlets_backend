import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoriesDto } from './dto/create-inventories.dto';
import { UpdateInventoriesDto } from './dto/update-inventories.dto';
@Controller('inventories')
export class InventoriesController {
    constructor(private readonly inventoriesService: InventoriesService) { }

    @Post()
    create(@Body() createInventoriesDto: CreateInventoriesDto) {
        return this.inventoriesService.create(createInventoriesDto);
    }

    @Get()
    findAll() {
        return this.inventoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoriesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateInventoriesDto: UpdateInventoriesDto) {
        return this.inventoriesService.update(+id, updateInventoriesDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.inventoriesService.remove(+id);
    }
}
