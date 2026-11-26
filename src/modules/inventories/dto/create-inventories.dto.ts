import {
    IsInt,
    IsNumber,
    IsString,
    IsOptional,
    Min,
} from 'class-validator';

export class CreateInventoriesDto {
    @IsInt()
    company_id: number;

    @IsInt()
    outlet_id: number;

    @IsInt()
    menu_item_id: number;

    @IsInt()
    inventory_item_id: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    quantity: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    minimum_stock: number;

    @IsOptional()
    @IsString()
    unit?: string;
}