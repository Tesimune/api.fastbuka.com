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
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateVendorDto } from './dto/update-vendor.dto';

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
  update(
    @Headers('token') token: string,
    @Param('uuid') uuid: string,
    @Body() VendorUpdateInput: UpdateVendorDto,
  ) {
    return this.vendorService.update(token, uuid, VendorUpdateInput);
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  @Version('1')
  @Delete(':uuid')
  remove(
    @Headers('token') token: string,
    @Param('uuid') uuid: string,
  ) {
    return this.vendorService.remove(token, uuid);
  }
}
