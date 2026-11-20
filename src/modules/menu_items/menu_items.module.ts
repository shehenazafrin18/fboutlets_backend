import { Module } from '@nestjs/common';
import { MenuItemsController } from './menu_items.controller';

@Module({
  controllers: [MenuItemsController]
})
export class MenuItemsModule {}
