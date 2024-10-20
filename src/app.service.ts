import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { Food } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  index(): string {
    return 'Welcome to Fast Buka';
  }

  health(): string {
    return 'Welcome to Fast Buka, Application running.';
  }

  async home(): Promise<Food[]> {
    const foodData = await this.databaseService.food.findMany();
    return foodData;
  }
}
