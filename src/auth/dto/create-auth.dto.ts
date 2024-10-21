import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'Your full name' })
  name: string;

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
  contact?: string;

  @IsOptional()
  @IsString()
  account_type?: string = 'user';

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
