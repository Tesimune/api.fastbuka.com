import { Injectable } from '@nestjs/common';
import { foods } from './seeder/data/foods.data';

@Injectable()
export class AppService {
  index(): string {
    return 'Welcome to Fast Buka';
  }

  health(): string {
    return 'Welcome to Fast Buka, Application running.';
  }

  home(): string {
    return JSON.stringify(foods);
  }
}
