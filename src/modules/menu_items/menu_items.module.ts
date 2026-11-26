import { Module } from '@nestjs/common';
import { MenuItemsController } from './menu_items.controller';
import { MenuItemsService } from './menu_items.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuItem } from '@/models/menu_items.model';

@Module({
  imports: [SequelizeModule.forFeature([MenuItem])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService]
})
export class MenuItemsModule { }
