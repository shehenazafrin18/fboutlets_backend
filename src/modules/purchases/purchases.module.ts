import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Purchase } from '@/models/purchases.model';
import { PurchaseItem } from '@/models/purchase_items.model';
import { Supplier } from '@/models/suppliers.model';

@Module({
  imports: [SequelizeModule.forFeature([Purchase, PurchaseItem, Supplier])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule { }
