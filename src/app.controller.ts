import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  index(): string {
    return this.appService.index();
  }

  health(): string {
    return this.appService.health();
  }

  @Version('1')
  @Get()
  @ApiTags('app')
  home(): string {
    return this.appService.home();
  }
}
