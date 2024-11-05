import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { StorageService } from 'src/storage/storage.service';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, MiddlewareService, StorageService, EncryptionService],
})
export class UsersModule {}
