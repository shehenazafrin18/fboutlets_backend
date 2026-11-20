import { Module } from '@nestjs/common';
import { OutletReceiptCountersController } from './outlet_receipt_counters.controller';
import { OutletReceiptCountersService } from './outlet_receipt_counters.service';

@Module({
  controllers: [OutletReceiptCountersController],
  providers: [OutletReceiptCountersService]
})
export class OutletReceiptCountersModule {}
