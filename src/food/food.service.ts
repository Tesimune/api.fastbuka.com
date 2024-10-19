import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { DatabaseService } from 'src/database/database.service';
import { Express } from 'express';
import { FoodData } from './food.data';

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createFoodDto: CreateFoodDto, image: Express.Multer.File) {
    const foodData = {
      ...createFoodDto,
      image: `/uploads/${image.filename}`,
    };
    return this.databaseService.food.create({
      data: foodData as any,
    });
  }
  findAll() {
    // return this.databaseService.food.findMany();
    return FoodData;
  }

  findOne(uuid: string) {
    return this.databaseService.food.findUnique({
      where: { uuid },
    });
  }

  update(uuid: string, updateFoodDto: UpdateFoodDto) {
    return this.databaseService.food.update({
      where: { uuid },
      data: updateFoodDto as any,
    });
  }

  remove(uuid: string) {
    return this.databaseService.food.delete({
      where: { uuid },
    });
  }
}
