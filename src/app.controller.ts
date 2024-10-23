import { Body, Controller, Get, Post, Query, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

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
  home(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{}> {
    return this.appService.home(page, pageSize, sortField, sortOrder);
  }

  @Version('1')
  @Get('menu')
  @ApiTags('app')
  menu(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{}> {
    return this.appService.menu(page, pageSize, sortField, sortOrder);
  }

  @Version('1')
  @Get('partner')
  @ApiTags('app')
  partner(): Promise<{}> {
    return this.appService.partner();
  }

  @Version('1')
  @Get('about')
  @ApiTags('app')
  about(): Promise<{}> {
    return this.appService.about();
  }

  @Version('1')
  @Get('contact')
  @ApiTags('app')
  contact(): Promise<{}> {
    return this.appService.contact();
  }

  @Version('1')
  @Post('contact')
  @ApiTags('app')
  form(@Body() name: string, email: string, subject: string, phone: string, message: string): Promise<{}> {
    return this.appService.form(name, email, subject, phone, message);
  }
}
