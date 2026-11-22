
import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuCategoriesDto } from './create-menu_categories.dto';

export class UpdateMenuCategoriesDto extends PartialType(
    CreateMenuCategoriesDto,
) { }