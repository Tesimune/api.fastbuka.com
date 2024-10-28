import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MiddlewareService } from 'src/middleware/middleware.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CartController],
  providers: [CartService, MiddlewareService],
})
export class CartModule {}
