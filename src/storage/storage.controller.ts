import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Headers,
  Body,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateStorageDto } from './dto/create-storage.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Version('1')
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Headers('token') token: string,
    @Body(ValidationPipe) body: CreateStorageDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.storageService.create(token, body.use, file);
  }

  @Version('1')
  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Headers('token') token: string,
    @Body(ValidationPipe) body: CreateStorageDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.storageService.update(token, body.use, file);
  }
}
