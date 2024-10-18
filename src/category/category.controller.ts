import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Version('1')
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
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
  update(
    @Param('uuid') uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(uuid, updateCategoryDto);
  }

  @Version('1')
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.categoryService.remove(uuid);
  }
}
