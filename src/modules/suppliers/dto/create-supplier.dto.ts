import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsEmail,
} from 'class-validator';

export class CreateSupplierDto {

    @IsNumber()
    company_id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    contact_person?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    tax_number?: string;
}