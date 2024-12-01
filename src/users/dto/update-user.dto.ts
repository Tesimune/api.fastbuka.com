import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ApiTags('users')
export class UpdateUserDto {
  @IsString()
  @ApiProperty({ example: 'John', description: 'First name' })
  first_name: string;

  @IsString()
  @ApiProperty({ example: 'Doe', description: 'Last name' })
  last_name: string;

  @IsEmail()
  @ApiProperty({
    example: 'info@fastbuka.com',
    description: 'Your email address',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '@password1',
    description: 'Your password, eight character long, symbol and number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  contact?: string;

  @IsOptional()
  @IsString()
  account_type?: string = 'user';

  @IsOptional()
  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  profile?: Express.Multer.File;

  @IsOptional()
  @IsString()
  @ApiProperty()
  profileUrl?: string;

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


export class PasswordDto {
  @IsString()
  @ApiProperty({
    example: '@password1',
    description: 'Your password, eight character long, symbol and number',
  })
  password: string;
}