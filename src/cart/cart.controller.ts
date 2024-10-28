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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Version('1')
  @Post('increase/:food_uuid')
  create(
    @Headers('token') token: string,
    @Param('food_uuid') food_uuid: string,
  ) {
    return this.cartService.increase(token, food_uuid);
  }

  @Version('1')
  @Patch('decrease/:food_uuid')
  update(
    @Headers('token') token: string,
    @Param('food_uuid') food_uuid: string,
  ) {
    return this.cartService.decrease(token, food_uuid);
  }
  
  @Version('1')
  @Get()
  findAll(
    @Headers('token') token: string,
  ) {
    return this.cartService.findAll(token);
  }

  @Version('1')
  @Get(':vendor_uuid')
  findOne(
    @Headers('token') token: string,
    @Param('vendor_uuid') vendor_uuid: string,
  ) {
    return this.cartService.findOne(token, vendor_uuid);
  }



  @Version('1')
  @Delete(':vendor_uuid')
  remove(
    @Headers('token') token: string,
    @Param('vendor_uuid') vendor_uuid: string,
  ) {
    return this.cartService.remove(token, vendor_uuid);
  }
}
