import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryItemService } from './inventory_item.service';
import { CreateInventoryItemDto } from './dto/create-inventory_item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory_item.dto';

@Controller('inventory-item')
export class InventoryItemController {
    constructor(private readonly inventoryItemService: InventoryItemService) { }

    @Post()
    create(@Body() createInventoriesDto: CreateInventoryItemDto) {
        return this.inventoryItemService.create(createInventoriesDto);
    }

    @Get()
    findAll() {

        return this.inventoryItemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoryItemService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateInventoryItemDto: UpdateInventoryItemDto) {
        return this.inventoryItemService.update(+id, updateInventoryItemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.inventoryItemService.remove(+id);
    }
}
