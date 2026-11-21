import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryTransactionsController } from './inventory_transactions.controller';
import { InventoryTransactionsService } from './inventory_transactions.service';
import { InventoryTransaction } from '@/models/inventory_transactions.model';
import { Inventory } from '@/models/inventories.model';
import { InventoryItem } from '@/models/inventory_items.model';
import { Company } from '@/models/company.model';
import { Outlet } from '@/models/outlet.model';

@Module({
  imports: [SequelizeModule.forFeature([InventoryTransaction, Inventory, InventoryItem, Company, Outlet])],
  controllers: [InventoryTransactionsController],
  providers: [InventoryTransactionsService]
})
export class InventoryTransactionsModule { }
