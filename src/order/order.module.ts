import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MiddlewareService } from 'src/middleware/middleware.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [OrderService, MiddlewareService],
})
export class OrderModule {}
