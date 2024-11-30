import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService, MiddlewareService],
})
export class AdminModule {}
