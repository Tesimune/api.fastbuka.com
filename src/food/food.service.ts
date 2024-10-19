import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { DatabaseService } from 'src/database/database.service';
import { foods } from 'src/seeder/data/foods.data';

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createFoodDto: CreateFoodDto, image: Express.Multer.File) {
    const foodData = {
      ...createFoodDto,
      image: `/uploads/${image.filename}`,
    };
    const food = this.databaseService.food.create({
      data: foodData as any,
    });

    return {
      status: 200,
      success: true,
      message: 'Food created successfully',
      data: {
        food
      } 
    }
  }

  findAll() {
    const foods = this.databaseService.food.findMany();
    return {
      status: 200,
      success: true,
      message: 'Foods retrieved successfully',
      data: {
        foods
      } 
    }
  }

  findOne(uuid: string) {
    const food = this.databaseService.food.findUnique({
      where: { uuid },
    });
    return {
      status: 200,
      success: true,
      message: 'Food retrieved successfully',
      data: {
        food
      } 
    }
  }

  update(uuid: string, updateFoodDto: UpdateFoodDto) {
    const food = this.databaseService.food.update({
      where: { uuid },
      data: updateFoodDto as any,
    });
    return {
      status: 200,
      success: true,
      message: 'Food updated successfully',
      data: {
        food
      } 
    }
  }

  remove(uuid: string) {
    this.databaseService.food.delete({
      where: { uuid },
    });
    return {
      status: 200,
      success: true,
      message: 'Food deleted successfully',
    }
  }
}
