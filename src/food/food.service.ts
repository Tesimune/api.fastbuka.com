import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createFoodDto: CreateFoodDto) {
    const food = await this.databaseService.food.create({
      data: createFoodDto as any,
    });

    return {
      status: 200,
      success: true,
      message: 'Food created successfully',
      data: {
        food,
      },
    };
  }

  async findAll() {
    const foods = await this.databaseService.food.findMany();
    return {
      status: 200,
      success: true,
      message: 'Food retrieved successfully',
      data: {
        foods,
      },
    };
  }

  async findOne(uuid: string) {
    const food = await this.databaseService.food.findUnique({
      where: { uuid },
    });
    return {
      status: 200,
      success: true,
      message: 'Food retrieved successfully',
      data: {
        food,
      },
    };
  }

  async update(uuid: string, updateFoodDto: UpdateFoodDto) {
    const food = await this.databaseService.food.update({
      where: { uuid },
      data: updateFoodDto as any,
    });
    return {
      status: 200,
      success: true,
      message: 'Food updated successfully',
      data: {
        food,
      },
    };
  }

  async remove(uuid: string) {
    await this.databaseService.food.delete({
      where: { uuid },
    });
    return {
      status: 200,
      success: true,
      message: 'Food deleted successfully',
    };
  }
}
