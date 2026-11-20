import { Module } from '@nestjs/common';
import { OutletMenuController } from './outlet_menu.controller';

@Module({
  controllers: [OutletMenuController]
})
export class OutletMenuModule {}
