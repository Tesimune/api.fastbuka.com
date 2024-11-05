import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto {
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
}

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({
    example: '@password1',
    description: 'Your password, eight character long, symbol and number',
  })
  old_password: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '@password1',
    description: 'Your password, eight character long, symbol and number',
  })
  new_password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'info@fastbuka.com',
    description: 'Your email address',
  })
  email: string;
}

export class DecryptDto {
  @IsString()
  @ApiProperty({
    description: 'Authorization token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  token: string;
}

export class ResetPasswordDto {
  @IsString()
  @ApiProperty({
    example: '5992f160-54f3-42ac-96e0-ace33adc99df',
    description: 'User uuid',
  })
  uuid: string;

  @IsEmail()
  @ApiProperty({
    example: 'info@fastbuka.com',
    description: 'Your email address',
  })
  email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({
    example: '1234',
    description: 'Verification code sent to user email',
  })
  code: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '@password1',
    description: 'Your password, eight character long, symbol and number',
  })
  new_password: string;
}

export class VerifyEmailDto {
  @IsString()
  @ApiProperty({
    example: '5992f160-54f3-42ac-96e0-ace33adc99df',
    description: 'User uuid',
  })
  uuid: string;

  @IsEmail()
  @ApiProperty({
    example: 'info@fastbuka.com',
    description: 'Your email address',
  })
  email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({
    example: '1234',
    description: 'Verification code sent to user email',
  })
  code: string;
}

export class ResendEmailCodeDto {
  @IsEmail()
  @ApiProperty({
    example: 'info@fastbuka.com',
    description: 'Your email address',
  })
  email: string;
}
