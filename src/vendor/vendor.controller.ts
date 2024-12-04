import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Patch,
  Version,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('vendor')
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  /**
   *
   * @param token
   * @param vendor
   * @returns
   */
  @Version('1')
  @Post('/')
  create(
    @Headers('token') token: string,
    @Body(ValidationPipe) vendor: CreateVendorDto,
  ) {
    return this.vendorService.create(token, vendor);
  }

  /**
   *
   * @param page
   * @param pageSize
   * @returns
   */
  @Version('1')
  @Get()
  findAll(@Headers('token') token: string) {
    return this.vendorService.findAll(token);
  }

  /**
   *
   * @param slug
   * @returns
   */
  @Version('1')
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.vendorService.findOne(slug);
  }

  /**
   *
   * @param uuid
   * @param VendorUpdateInput
   * @returns
   */
  @Version('1')
  @Patch(':uuid')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profile'))
  @UseInterceptors(FileInterceptor('cover'))
  @UseInterceptors(FileInterceptor('id_upload'))
  @UseInterceptors(FileInterceptor('business_upload'))
  update(
    @Headers('token') token: string,
    @Param('uuid') uuid: string,
    @Body(ValidationPipe) VendorUpdateInput: UpdateVendorDto,
    @UploadedFile('profile') profile?: Express.Multer.File,
    @UploadedFile('cover') cover?: Express.Multer.File,
    @UploadedFile('id_upload') id_upload?: Express.Multer.File,
    @UploadedFile('business_upload') business_upload?: Express.Multer.File,
  ) {
    return this.vendorService.update(
      token,
      uuid,
      VendorUpdateInput,
      profile,
      cover,
      id_upload,
      business_upload,
    );
  }

  /**
   *
   * @param uuid
   * @returns
   */
  @Version('1')
  @Delete(':uuid')
  remove(@Headers('token') token: string, @Param('uuid') uuid: string) {
    return this.vendorService.remove(token, uuid);
  }
}
