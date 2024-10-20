import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Food } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @ApiTags('app')
  index(): string {
    return this.appService.index();
  }

  @Get('health')
  @ApiTags('app')
  health(): string {
    return this.appService.health();
  }

  @Version('1')
  @Get('home')
  @ApiTags('app')
  async home(): Promise<Food[]> {
    return this.appService.home();
  }
}
