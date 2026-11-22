import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuCategoriesController } from './menu_categories.controller';
import { MenuCategoriesService } from './menu_categories.service';
import { MenuCategory } from '@/models/menu_categories.model';

@Module({
  imports: [SequelizeModule.forFeature([MenuCategory])],
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService]
})
export class MenuCategoriesModule { }
