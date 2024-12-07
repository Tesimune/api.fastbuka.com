import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

@ApiTags('vendor')
export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  slug?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  user_uuid?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  profile?: Express.Multer.File;

  @IsOptional()
  @IsString()
  @ApiProperty()
  profileUrl?: string;

  @IsOptional()
  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  cover?: Express.Multer.File;

  @IsOptional()
  @IsString()
  @ApiProperty()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  state?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  location?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  longitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  latitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  ratings?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  featured?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  is_online?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  category?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  opening_time?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  closing_time?: string;

  // Vendor documentation
  @IsOptional()
  @IsString()
  @ApiProperty()
  id_number?: string;

  @IsOptional()
  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  id_upload?: Express.Multer.File;

  @IsOptional()
  @IsString()
  @ApiProperty()
  id_uploadUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  business_number?: string;

  @IsOptional()
  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  business_upload?: Express.Multer.File;

  @IsOptional()
  @IsString()
  @ApiProperty()
  business_uploadUrl?: string;
}
