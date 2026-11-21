import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoriesDto } from './create-inventories.dto';

export class UpdateInventoriesDto extends PartialType(
    CreateInventoriesDto,
) { }