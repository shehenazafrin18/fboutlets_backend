import { Module } from '@nestjs/common';
import { MenuCategoriesController } from './menu_categories.controller';
import { MenuCategoriesService } from './menu_categories.service';

@Module({
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService]
})
export class MenuCategoriesModule {}
