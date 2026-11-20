import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Abdur' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  declare first_name: string;

  @ApiProperty({ example: 'Rahman' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  declare last_name: string;

  @ApiProperty({ example: 'abdur@example.com' })
  @IsNotEmpty()
  @IsEmail()
  declare email: string;

  @ApiProperty({ example: '+8801843106943', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid number with optional + prefix',
  })
  declare phone?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  declare password: string;
} 