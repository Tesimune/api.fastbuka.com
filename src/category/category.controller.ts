import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Version('1')
  @Post(':vendor_slug')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Headers('token') token: string, 
    @Param('vendor_slug') vendor_slug:string, 
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile('image') image: Express.Multer.File
  ) {
    return this.categoryService.create(token, vendor_slug, createCategoryDto, image);
  }

  @Version('1')
  @Get(':vendor_slug')
  findAll(
    @Param('vendor_slug') vendor_slug: string,
  ) {
    return this.categoryService.findAll(vendor_slug);
  }

  @Version('1')
  @Get(':vendor_slug/:uuid')
  findOne(
    @Param('vendor_slug') vendor_slug: string,
    @Param('uuid') uuid: string,
  ) {
    return this.categoryService.findOne(vendor_slug, uuid);
  }

  @Version('1')
  @Patch(':vendor_slug/:uuid')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Headers('token') token: string, 
    @Param('vendor_slug') vendor_slug:string,
    @Param('uuid') uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile('image') image: Express.Multer.File
  ) {
    return this.categoryService.update(token, vendor_slug, uuid, updateCategoryDto, image);
  }

  @Version('1')
  @Delete(':vendor_slug/:uuid')
  remove(
    @Headers('token') token: string, 
    @Param('vendor_slug') vendor_slug:string,
    @Param('uuid') uuid: string,
  ) {
    return this.categoryService.remove(token, vendor_slug, uuid);
  }
}
