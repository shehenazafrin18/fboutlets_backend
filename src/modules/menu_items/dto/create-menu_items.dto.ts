
import {
    IsInt,
    IsNumber,
    IsString,
    IsOptional,
    Min,
    IsDecimal,
} from 'class-validator';

export class CreateMenuItemsDto {
    @IsInt()
    company_id: number;

    @IsInt()
    category_id: number;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsOptional()
    @IsDecimal()
    base_price?: string;
}
