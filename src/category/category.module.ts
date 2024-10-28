import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, MiddlewareService, StorageService],
})
export class CategoryModule {}
