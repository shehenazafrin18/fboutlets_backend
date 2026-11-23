import {
    IsInt,
    IsNumber,
    IsString,
    IsOptional,
    Min,
} from 'class-validator';

export class CreateMenuCategoriesDto {
    // @IsInt()
    // company_id: number;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    display_order?: number;
}
