import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  vendor_uuid: string;

  @IsString()
  name: string;

  @IsString()
  image: string;
}
