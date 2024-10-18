import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

@ApiTags('food')
export class CreateFoodDto {
  @IsString()
  @ApiProperty()
  vendor_uuid: string;

  @IsString()
  @ApiProperty()
  category_uuid: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  image: string;

  @IsNumber()
  @ApiProperty()
  price: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  discount?: string;

  @IsString()
  @ApiProperty()
  processing_time?: string;

  @IsBoolean()
  @ApiProperty()
  ready_made: string;
}
