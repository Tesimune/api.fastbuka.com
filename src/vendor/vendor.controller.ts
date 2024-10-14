import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  // Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
// import { Prisma } from '@prisma/client';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post('/')
  create(
    @Headers('token') token: string,
    @Body(ValidationPipe) vendor: CreateVendorDto,
  ) {
    return this.vendorService.create(token, vendor);
  }

  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() VendorUpdateInput: UpdateVendorDto,
  // ) {
  //   return this.vendorService.update(+id, VendorUpdateInput);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }
}
