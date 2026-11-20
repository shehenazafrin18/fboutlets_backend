import { Module } from '@nestjs/common';
import { SalesItemsController } from './sales_items.controller';
import { SalesItemsService } from './sales_items.service';

@Module({
  controllers: [SalesItemsController],
  providers: [SalesItemsService]
})
export class SalesItemsModule {}
