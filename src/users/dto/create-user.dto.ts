import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'John', description: 'Your first name' })
  first_name: string;

  @IsString()
  @ApiProperty({ example: 'Doe', description: 'Your last name' })
  last_name: string;

  @IsEmail()
  @ApiProperty({ example: 'info@fastbuka.com', description: 'Your email address' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: '@password1', description: 'Your password, eight character long, symbol and number' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  contact?: string;

  @IsOptional()
  @IsString()
  account_type?: string = 'user';

  @IsOptional()
  @IsString()
  @ApiProperty()
  profile?: string;

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
  address?: string;
}