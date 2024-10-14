import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { VendorModule } from './vendor/vendor.module';
import { CategoryModule } from './category/category.module';
import { FoodModule } from './food/food.module';
import { MiddlewareService } from './middleware/middleware.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    VendorModule,
    CategoryModule,
    FoodModule,
  ],
  controllers: [AppController],
  providers: [AppService, MiddlewareService],
  exports: [MiddlewareService],
})
export class AppModule {}
