import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

@ApiTags('food')
export class CreateFoodDto {
  @IsString()
  @ApiProperty()
  vendor_uuid: string;

  @IsOptional()
  @ApiProperty()
  category_uuid?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image?: Express.Multer.File;

  @IsOptional()
  @ApiProperty()
  imageUrl?: string;

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
