import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  cac_number: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  // @isDate()
  opening_time: string;

  @IsString()
  @IsOptional()
  // @isDate()
  closing_time: string;
}
