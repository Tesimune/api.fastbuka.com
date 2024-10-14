import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { DatabaseService } from 'src/database/database.service';
import { Express } from 'express';

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
    return this.databaseService.food.findMany();
  }

  findOne(id: number) {
    return this.databaseService.food.findUnique({
      where: { id },
    });
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return this.databaseService.food.update({
      where: { id },
      data: updateFoodDto as any,
    });
  }

  remove(id: number) {
    return this.databaseService.food.delete({
      where: { id },
    });
  }
}
