import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  index(): string {
    return this.appService.index();
  }

  @Get('health')
  health(): string {
    return this.appService.health();
  }

  @Version('1')
  @Get('home')
  @ApiTags('app')
  home(): string {
    return this.appService.home();
  }
}
