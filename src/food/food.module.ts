import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { DatabaseModule } from '../database/database.module';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FoodController],
  providers: [FoodService, MiddlewareService, StorageService],
})
export class FoodModule {}
