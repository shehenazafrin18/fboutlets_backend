
import {
    IsNumber,
    IsString,
    IsOptional,
    IsArray,
    IsDateString,
    ValidateNested,
    IsPositive,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {

    @IsNumber()
    @IsPositive()
    inventory_item_id: number;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNumber()
    @Min(0)
    unit_price: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discount?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    tax?: number;
}

export class CreatePurchaseDto {

    @IsNumber()
    company_id: number;

    @IsNumber()
    @IsPositive()
    supplier_id: number;

    @IsNumber()
    @IsPositive()
    outlet_id: number;

    @IsString()
    purchase_number: string;

    @IsDateString()
    purchase_date: string;

    @IsOptional()
    @IsNumber()
    created_by?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseItemDto)
    items: CreatePurchaseItemDto[];
}
