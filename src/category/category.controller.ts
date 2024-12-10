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
  ValidationPipe,
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
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Headers('token') token: string,
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
    @UploadedFile('image') image?: Express.Multer.File,
  ) {
    return this.categoryService.create(token, createCategoryDto, image);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Version('1')
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.categoryService.findOne(uuid);
  }

  @Version('1')
  @Patch(':uuid')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Headers('token') token: string,
    @Param('uuid') uuid: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
    @UploadedFile('image') image: Express.Multer.File,
  ) {
    return this.categoryService.update(token, uuid, updateCategoryDto, image);
  }

  @Version('1')
  @Delete(':uuid')
  remove(@Headers('token') token: string, @Param('uuid') uuid: string) {
    return this.categoryService.remove(token, uuid);
  }
}
