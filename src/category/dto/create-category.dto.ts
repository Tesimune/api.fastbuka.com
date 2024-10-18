import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ApiTags('category')
export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  vendor_uuid: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  image: string;
}
