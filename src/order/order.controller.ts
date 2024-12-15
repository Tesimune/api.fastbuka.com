import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Headers,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Version('1')
  @Post(':cart_uuid')
  create(
    @Headers('token') token: string,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(token, createOrderDto);
  }

  @Version('1')
  @Get()
  findAll(
    @Headers('token') token: string,
    @Query('order_status') order_status?: string,
  ) {
    return this.orderService.findAll(token, order_status);
  }

  @Version('1')
  @Get('vendor/:vendor_uuid')
  findVendorOrders(
    @Headers('token') token: string,
    @Param('vendor_uuid') vendor_uuid: string,
    @Query('order_status') order_status?: string,
  ) {
    return this.orderService.findVendOrders(token, vendor_uuid, order_status);
  }

  @Version('1')
  @Get()
  findOne(
    @Headers('token') token: string,
    @Query('order_status') order_status?: string,
  ) {
    return this.orderService.findOne(token, order_status);
  }
}
