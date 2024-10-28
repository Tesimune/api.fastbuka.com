import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { DatabaseModule } from 'src/database/database.module';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VendorController],
  providers: [VendorService, MiddlewareService, StorageService],
})
export class VendorModule {}
