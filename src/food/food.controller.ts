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
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Version('1')
  @Post()
  create(
    @Body() createFoodDto: CreateFoodDto,
  ) {
    return this.foodService.create(createFoodDto);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.foodService.findAll();
  }

  @Version('1')
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.foodService.findOne(uuid);
  }

  @Version('1')
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(uuid, updateFoodDto);
  }

  @Version('1')
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.foodService.remove(uuid);
  }
}
