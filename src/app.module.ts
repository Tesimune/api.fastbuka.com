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
import { TeamModule } from './team/team.module';
import { ContactModule } from './contact/contact.module';
import { PaymentModule } from './payment/payment.module';
import { EncryptionService } from './encryption/encryption.service';
import { EncryptionModule } from './encryption/encryption.module';
import { PartnerModule } from './partner/partner.module';

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
    TeamModule,
    ContactModule,
    EncryptionModule,
    PartnerModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, MiddlewareService, MailerService, StorageService, SeederService, EncryptionService],
  exports: [MiddlewareService, MailerService, StorageService, EncryptionService],
})
export class AppModule {}
