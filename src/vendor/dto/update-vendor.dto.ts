import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';

export class UpdateUserDto extends PartialType(CreateVendorDto) {}
