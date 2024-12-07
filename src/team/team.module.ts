import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
