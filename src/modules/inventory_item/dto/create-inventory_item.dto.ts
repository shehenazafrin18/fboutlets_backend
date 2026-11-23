import {
    IsInt,
    IsNumber,
    IsString,
    IsOptional,
    Min,
    isString, IsNotEmpty
} from 'class-validator';

export class CreateInventoryItemDto {
    @IsInt()
    company_id: number;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsOptional()
    @IsString()
    base_unit: string;

    @IsNumber({ maxDecimalPlaces: 3 })
    @IsNotEmpty()
    standard_cost: number;

}