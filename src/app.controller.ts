import { Body, Controller, Get, Post, Query, ValidationPipe, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { QueryParamsDto } from './app.dto';

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
  @Get('vendors')
  @ApiTags('app')
  vendors(
    @Query(ValidationPipe) query: QueryParamsDto
  ): Promise<{}> {
    const page = +query.page ? +query.page : 1;
    const perPage = query.perPage ? query.perPage : 20;
    return this.appService.vendors(+query.longitude, +query.latitude, +page, +perPage, query.sortField, query.sortOrder);
  }

  @Version('1')
  @Get('featured')
  @ApiTags('app')
  featured(
    @Query(ValidationPipe) query: QueryParamsDto
  ): Promise<{}> {
    const page = +query.page ? +query.page : 1;
    const perPage = query.perPage ? query.perPage : 20;
    return this.appService.featured(+query.longitude, +query.latitude, +page, +perPage, query.sortField, query.sortOrder);
  }

  @Version('1')
  @Get('food')
  @ApiTags('app')
  food(
    @Query(ValidationPipe) query: QueryParamsDto
  ): Promise<{}> {
    const page = +query.page ? +query.page : 1;
    const perPage = query.perPage ? query.perPage : 20;
    return this.appService.food(+query.longitude, +query.latitude, +page, +perPage, query.sortField, query.sortOrder);
  }

  @Version('1')
  @Get('trending')
  @ApiTags('app')
  trending(
    @Query(ValidationPipe) query: QueryParamsDto
  ): Promise<{}> {
    const page = +query.page ? +query.page : 1;
    const perPage = query.perPage ? query.perPage : 20;
    return this.appService.trending(+query.longitude, +query.latitude, +page, +perPage, query.sortField, query.sortOrder);
  }

  @Version('1')
  @Get('categories')
  @ApiTags('app')
  categories(): Promise<{}> {
    return this.appService.findAll();
  }

  @Version('1')
  @Get('home')
  @ApiTags('app')
  home(
    @Query(ValidationPipe) query: QueryParamsDto
  ): Promise<{}> {
    const page = +query.page ? +query.page : 1;
    const perPage = query.perPage ? query.perPage : 20;
    return this.appService.home(+page, +perPage, query.sortField, query.sortOrder);
  }

  @Version('1')
  @Get('menu')
  @ApiTags('app')
  menu(
    @Query(ValidationPipe) query: QueryParamsDto
  ): Promise<{}> {
    const page = +query.page ? +query.page : 1;
    const perPage = query.perPage ? query.perPage : 20;
    return this.appService.menu(+page, +perPage, query.sortField, query.sortOrder);
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
