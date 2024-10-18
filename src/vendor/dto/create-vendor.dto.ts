import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

@ApiTags('vendor')
export class CreateVendorDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  cac_number: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  country: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  state: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  address: string;

  @IsString()
  @IsOptional()
  // @isDate()
  @ApiProperty()
  opening_time: string;

  @IsString()
  @IsOptional()
  // @isDate()
  @ApiProperty()
  closing_time: string;
}
