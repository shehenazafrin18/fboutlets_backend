import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import { Inventory } from '@/models/inventories.model';

@Module({
  imports: [SequelizeModule.forFeature([Inventory])],
  controllers: [InventoriesController],
  providers: [InventoriesService]
})
export class InventoriesModule { }
