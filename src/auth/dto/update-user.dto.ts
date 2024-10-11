import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, CreateUserProfileDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
