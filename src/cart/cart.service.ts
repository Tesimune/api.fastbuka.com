import { HttpException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';

@Injectable()
export class CartService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService,
  ){}



  async increase(token: string, food_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    const food = await this.databaseService.food.findUnique({
      where: { uuid: food_uuid }
    })
    if(!food){
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Food not found',
      }, 404)
    }
    const cart = await this.databaseService.cart.upsert({
      where: { user_uuid_vendor_uuid: { user_uuid: auth.uuid, vendor_uuid: food.vendor_uuid } },
      create: {
        user_uuid: auth.uuid,
        vendor_uuid: food.vendor_uuid,
      },
      update: {
        user_uuid: auth.uuid,
        vendor_uuid: food.vendor_uuid,
      }
    })

    const cartItem = await this.databaseService.cartItem.upsert({
      where: { cart_uuid_food_uuid: {cart_uuid: cart.uuid, food_uuid} },
      create: {
        cart_uuid: cart.uuid,
        food_uuid: food_uuid,
        price: food.price,
        quantity: 1,
      },
      update: {
        price: food.price,
        quantity: {
          increment: 1
        }
      }
    })
    return {
      status: 200,
      success: true,
      message: 'Cart item added successfully',
      data: {
        cartItem
      }
    };
  }

  
  async decrease(token: string, food_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    const food = await this.databaseService.food.findUnique({
      where: { uuid: food_uuid }
    })
    if(!food){
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Food not found',
      }, 404)
    }
    const cart = await this.databaseService.cart.upsert({
      where: { user_uuid_vendor_uuid: { user_uuid: auth.uuid, vendor_uuid: food.vendor_uuid } },
      create: {
        user_uuid: auth.uuid,
        vendor_uuid: food.vendor_uuid,
      },
      update: {
        user_uuid: auth.uuid,
        vendor_uuid: food.vendor_uuid,
      }
    })

    const cartItem = await this.databaseService.cartItem.upsert({
      where: { cart_uuid_food_uuid: {cart_uuid: cart.uuid, food_uuid} },
      create: {
        cart_uuid: cart.uuid,
        food_uuid: food_uuid,
        price: food.price,
        quantity: 1,
      },
      update: {
        price: food.price,
        quantity: {
          decrement: 1
        }
      }
    })
    return {
      status: 200,
      success: true,
      message: 'Cart item added successfully',
      data: {
        cartItem
      }
    };
  }

  async findAll(token: string) {
    const auth = await this.middlewareService.decodeToken(token);
    const cart = await this.databaseService.cart.findMany({
      where: { user_uuid: auth.uuid },
      include: {
        vendor: true,
        cartItems: true,
      }
    })
    return {
      status: 200,
      success: true,
      message: 'Cart items found successfully',
      data: {
        cart
      }
    };
  }

  async findOne(token: string, vendor_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token)
    const cart = await this.databaseService.cart.findFirst({
      where: { user_uuid: auth.uuid, vendor_uuid }
    })
    const cartItem = await this.databaseService.cartItem.findUnique({
      where: { uuid: cart.vendor_uuid },
      include: {
        cart: true,
        food: true,
      }
    })

    return {
      status: 200,
      success: true,
      message: 'Cart item found successfully',
      data: {
        cartItem
      }
    }
    
  }


  async remove(token: string, vendor_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    await this.databaseService.cart.delete({
      where: { user_uuid_vendor_uuid: { user_uuid: auth.uuid, vendor_uuid } },
      include: {
        cartItems: true,
      }
    })

    return {
      status: 200,
      success: true,
      message: 'Cart item removed successfully',
    }
  }
}
