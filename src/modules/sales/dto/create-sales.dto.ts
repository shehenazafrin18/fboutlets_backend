// import {
//     IsInt,
//     IsNumber,
//     IsString,
//     IsOptional,
//     Min,
// } from 'class-validator';

// export class CreateSalesDto {
//     @IsInt()
//     company_id: number;

//     @IsOptional()
//     @IsString()
//     name: string;

//     @IsOptional()
//     @IsString()
//     description?: string;

//     @IsOptional()
//     @IsNumber()
//     display_order?: number;
// }

import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleItemDto {
    @IsNumber()
    menu_item_id: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateSalesDto {
    @IsUUID()
    outlet_id: string;

    @IsEnum(['CASH', 'CARD', 'MOBILE_BANKING'])
    payment_method: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discount?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleItemDto)
    items: CreateSaleItemDto[];
}

