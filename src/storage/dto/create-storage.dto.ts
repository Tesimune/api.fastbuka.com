import { IsString, IsNotEmpty, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { Express } from 'express';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStorageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'profile', description: 'The use case of the file' })
  use: string;

  @Type(() => Object)
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
