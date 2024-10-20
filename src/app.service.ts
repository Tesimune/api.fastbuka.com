import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  index(): string {
    return 'Welcome to Fast Buka';
  }

  health(): string {
    return 'Welcome to Fast Buka, Application running.';
  }

  async home(): Promise<object> {
    const foods = await this.databaseService.food.findMany();
    const vendor = await this.databaseService.vendor.findMany();

    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        trending: foods,
        restaurants: vendor,
        menu: foods,
      },
    };
  }

  async menu(): Promise<object> {
    const foods = await this.databaseService.food.findMany();

    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        trending: foods,
        menu: foods,
      },
    };
  }

  async partner(): Promise<object> {
    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        
      },
    };
  }
  
  async about(): Promise<object> {
    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        
      },
    };
  }

  async contact(): Promise<{}> {
    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        
      },
    };
  }

  async form(): Promise<{}> {
    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        
      },
    };
  }
}
