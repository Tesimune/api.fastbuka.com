import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@ApiTags('category')
export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;

  
  @IsOptional()
  @IsString()
  @ApiProperty()
  imageUrl?: string;
}
