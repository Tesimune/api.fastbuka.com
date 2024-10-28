import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

@ApiTags('category')
export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  vendor_uuid: string;

  @IsString()
  @ApiProperty()
  name: string;

  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: Express.Multer.File;
}
