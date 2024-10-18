import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto {
  @IsEmail()
  @ApiProperty({ example: 'info@fastbuka.com', description: 'Your email address' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: '@password1', description: 'Your password, eight character long, symbol and number' })
  password: string;

}