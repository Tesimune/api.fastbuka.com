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
import { SeederService } from './seeder/seeder.service';
import { SeederModule } from './seeder/seeder.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { MailerModule } from './mailer/mailer.module';
import { MailerService } from './mailer/mailer.service';
import { StorageModule } from './storage/storage.module';
import { StorageService } from './storage/storage.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    VendorModule,
    CategoryModule,
    FoodModule,
    SeederModule,
    CartModule,
    OrderModule,
    MailerModule,
    StorageModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MiddlewareService, MailerService, StorageService, SeederService],
  exports: [MiddlewareService, MailerService, StorageService],
})
export class AppModule {}
