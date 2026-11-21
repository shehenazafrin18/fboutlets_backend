import { Module } from '@nestjs/common';
import { OutletMenuController } from './outlet_menu.controller';
import { OutletMenu } from '@/models/outlet_menu.model';
import { Outlet } from '@/models/outlet.model';
import { MenuCategory } from '@/models/menu_categories.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { OutletMenuService } from './outlet_menu.service';
import { MenuItem } from '@/models/menu_items.model';

@Module({
  imports: [SequelizeModule.forFeature([OutletMenu, MenuCategory, Outlet, MenuItem])],
  controllers: [OutletMenuController],
  providers: [OutletMenuService],
})
export class OutletMenuModule { }
