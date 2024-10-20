import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [SeederService, DatabaseService],
})
export class SeederModule {}
