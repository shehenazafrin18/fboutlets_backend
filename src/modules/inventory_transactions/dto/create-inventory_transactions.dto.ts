import {
    IsInt,
    IsEnum,
    IsNumber,
    Min,
    IsOptional,
    IsString,
} from 'class-validator';

export enum InventoryTransactionType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT',
}

export class CreateInventoryTransactionsDto {
    @IsInt()
    company_id: number;

    @IsInt()
    outlet_id: number;

    @IsInt()
    inventory_item_id: number;

    @IsEnum(InventoryTransactionType)
    type: InventoryTransactionType;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    quantity: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    unit_cost?: number;

    @IsOptional()
    @IsString()
    reference?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}