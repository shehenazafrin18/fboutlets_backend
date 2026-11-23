import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryItemController } from './inventory_item.controller';
import { InventoryItemService } from './inventory_item.service';
import { InventoryItem } from '@/models/inventory_items.model';

@Module({
  imports: [SequelizeModule.forFeature([InventoryItem])],
  controllers: [InventoryItemController],
  providers: [InventoryItemService]
})
export class InventoryItemModule { }
