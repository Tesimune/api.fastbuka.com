import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { MailerService } from 'src/mailer/mailer.service';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, MiddlewareService, MailerService, EncryptionService],
})
export class AuthModule {}
