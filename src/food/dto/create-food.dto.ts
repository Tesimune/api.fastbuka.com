import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  vendor_uuid: string;

  @IsString()
  category_uuid: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsNumber()
  price: string;

  @IsOptional()
  @IsNumber()
  discount?: string;

  @IsString()
  processing_time?: string;

  @IsBoolean()
  ready_made: string;
}
