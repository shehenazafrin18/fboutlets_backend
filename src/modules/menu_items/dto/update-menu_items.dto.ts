

import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemsDto } from './create-menu_items.dto';

export class UpdateMenuItemsDto extends PartialType(
    CreateMenuItemsDto,
) { }

