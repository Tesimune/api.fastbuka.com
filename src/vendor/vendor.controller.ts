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

  @Version('1')
  @Post('/')
  create(
    @Headers('token') token: string,
    @Body(ValidationPipe) vendor: CreateVendorDto,
  ) {
    return this.vendorService.create(token, vendor);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @Version('1')
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.vendorService.findOne(uuid);
  }

  @Version('1')
  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() VendorUpdateInput: UpdateVendorDto,
  ) {
    return this.vendorService.update(uuid, VendorUpdateInput);
  }

  @Version('1')
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.vendorService.remove(uuid);
  }
}
