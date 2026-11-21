import { IsNumber, Min } from 'class-validator';

export class UpdateOutletMenuPriceDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}