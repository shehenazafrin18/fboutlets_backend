import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

import { OutletMenu } from '@/models/outlet_menu.model';
import { SaleItem } from '@/models/sales_items.model';
import { Sale } from '@/models/sales.model';
import { Outlet } from '@/models/outlet.model';
import { Inventory } from '@/models/inventories.model';
import { InventoryTransaction } from '@/models/inventory_transactions.model';
import { MenuItem } from '@/models/menu_items.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Sale,
      SaleItem,
      Inventory,
      InventoryTransaction,
      OutletMenu,
      Outlet,
      MenuItem,
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule { }
