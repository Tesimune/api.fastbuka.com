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
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Version('1')
  @ApiBearerAuth()
  @Post(':vendor_slug')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Headers('Authorization') token: string,
    @Param('vendor_slug') vendor_slug: string,
    @Body(ValidationPipe) createFoodDto: CreateFoodDto,
    @UploadedFile('image') image?: Express.Multer.File,
  ) {
    return this.foodService.create(token, vendor_slug, createFoodDto, image);
  }

  @Version('1')
  @Get(':vendor_slug')
  findAll(@Param('vendor_slug') vendor_slug: string) {
    return this.foodService.findAll(vendor_slug);
  }

  @Version('1')
  @Get(':vendor_slug/:uuid')
  findOne(
    @Param('uuid') uuid: string,
    @Param('vendor_slug') vendor_slug: string,
  ) {
    return this.foodService.findOne(vendor_slug, uuid);
  }

  @Version('1')
  @ApiBearerAuth()
  @Patch(':vendor_slug/:uuid')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Headers('Authorization') token: string,
    @Param('vendor_slug') vendor_slug: string,
    @Param('uuid') uuid: string,
    @Body(ValidationPipe) updateFoodDto: UpdateFoodDto,
    @UploadedFile('image') image: Express.Multer.File,
  ) {
    return this.foodService.update(
      token,
      uuid,
      vendor_slug,
      updateFoodDto,
      image,
    );
  }

  @Version('1')
  @ApiBearerAuth()
  @Delete(':vendor_slug/:uuid')
  remove(
    @Headers('Authorization') token: string,
    @Param('vendor_slug') vendor_slug: string,
    @Param('uuid') uuid: string,
  ) {
    return this.foodService.remove(token, vendor_slug, uuid);
  }
}
