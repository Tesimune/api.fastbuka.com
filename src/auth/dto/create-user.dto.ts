import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'info@fastbuka.com', description: 'Your email address' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: '@eightcharacter1', description: 'Your password eight character long' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '+23480000000000', description: 'Your phone number' })
  contact?: string;

  @IsOptional()
  @IsString()
  account_type?: string = 'user';

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateUserProfileDto {
 
}
