import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StorageController],
  providers: [StorageService, MiddlewareService],
})
export class StorageModule {}
