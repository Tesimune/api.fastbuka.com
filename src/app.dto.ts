import {
  IsOptional,
  IsEnum,
  IsInt,
  IsPositive,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryParamsDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  longitude?: number | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  latitude?: number | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  perPage?: number | null;

  @ApiPropertyOptional({
    enum: [
      'price',
      'category',
      'ratings',
      'featured',
      'createdAt',
      'updatedAt',
    ],
  })
  @IsOptional()
  @IsEnum([
    'price',
    'category',
    'ratings',
    'featured',
    'createdAt',
    'updatedAt',
  ])
  sortField?:
    | 'price'
    | 'category'
    | 'ratings'
    | 'featured'
    | 'createdAt'
    | 'updatedAt'
    | null;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' | null;
}
