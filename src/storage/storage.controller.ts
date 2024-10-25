import { Controller, Get, Post, Patch, Param, Delete, UseInterceptors, UploadedFile, Headers } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Headers() token: string, @UploadedFile() file: Express.Multer.File) {
    return this.storageService.create(token, file);
  }

  @Get()
  findAll(@Headers() token: string) {
    return this.storageService.findAll(token);
  }

  @Get(':uuid')
  findOne(@Headers() token: string, @Param('uuid') uuid: string) {
    return this.storageService.findOne(token, uuid);
  }

  @Patch(':uuid')
  @UseInterceptors(FileInterceptor('file'))
  update(@Headers() token: string, @Param('uuid') uuid: string, @UploadedFile() file: Express.Multer.File) {
    return this.storageService.update(token, uuid, file);
  }

  @Delete(':uuid')
  remove(@Headers() token: string, @Param('uuid') uuid: string) {
    return this.storageService.remove(token, uuid);
  }
}
