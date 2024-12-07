import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { DatabaseModule } from 'src/database/database.module';
import { PartnerController } from './partners.controller';

@Module({
  imports: [DatabaseModule],
  providers: [PartnerService],
  controllers: [PartnerController],
})
export class PartnerModule {}
