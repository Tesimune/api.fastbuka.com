import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';


@Injectable()
export class OrderService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService
  ){}

  async create(token: string, cart_uuid: string, createOrderDto: CreateOrderDto) {
    const auth = await this.middlewareService.decodeToken(token);
  
    const cart = await this.databaseService.cart.findUnique({
      where: { uuid: cart_uuid, user_uuid: auth.uuid },
      include: {
        cartItems: true
      }
    });
  
    if (!cart) {
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Cart not found'
      }, 404);
    }
  
    const orderNumber = `${auth.username.slice(0, 2).toUpperCase()}-${cart.vendor_uuid.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
  
    const totalAmount = cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
    const order = await this.databaseService.order.create({
      data: {
        user_uuid: auth.uuid,
        vendor_uuid: cart.vendor_uuid,
        order_number: orderNumber,
        total_amount: totalAmount,
        delivery_name: createOrderDto.delivery_name,
        delivery_email: createOrderDto.delivery_email,
        delivery_contact: createOrderDto.delivery_contact,
        delivery_address: createOrderDto.delivery_address,
      },
      include: {
        orderItems: true,
        vendor: true
      }
    });
  
    for (const item of cart.cartItems) {
      await this.databaseService.orderItem.create({
        data: {
          order_uuid: order.uuid,
          food_uuid: item.food_uuid,
          price: item.price,
          quantity: item.quantity,
        },
        include: {
          food: true
        }
      });
    }
  
    return {
      status: 200,
      success: true,
      message: 'Order created successfully',
      data: {
        order
      }
    };
  }

  async findAll(token: string, order_status?: string) {
    const auth = await this.middlewareService.decodeToken(token);
  
    const orders = await this.databaseService.order.findMany({
      where: {
        user_uuid: auth.uuid,
        ...(order_status ? { order_status } : {}),
      },
      include: {
        orderItems: {
          include: {
            food: true 
          }
        },
        vendor: true
      }
    });
  
    return {
      status: 200,
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders
      }
    };
  }

  async findVendorOrders(token: string, vendor_uuid: string, order_status?: string) {
    const auth = await this.middlewareService.decodeToken(token);

    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        uuid: vendor_uuid,
        user_uuid: auth.uuid
      }
    });

    if (!vendor) {
      throw new HttpException({
        status: 403,
        success: false,
        message: 'Only vendors can access this endpoint',
      }, 403);
    }

    const orders = await this.databaseService.order.findMany({
      where: {
        vendor_uuid: vendor.uuid,
        ...(order_status ? { order_status } : {}),
      },
      include: {
        orderItems: {
          include: {
            food: true
          }
        },
        user: {
          select: {
            email: true,
            contact: true,
            username: true
          }
        }
      }
    });

    return {
      status: 200,
      success: true,
      message: 'Vendor orders retrieved successfully',
      data: {
        orders
      }
    };
  }
  

  async findOne(token: string, order_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
  
    const order = await this.databaseService.order.findUnique({
      where: {
        uuid: order_uuid,
        user_uuid: auth.uuid
      },
      include: {
        orderItems: {
          include: {
            food: true 
          }
        },
        vendor: true
      }
    })
    if(!order){
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Order not found',
      }, 404)
    }

    return {
      status: 200,
      success: true,
      message: 'Order retrieved successfully',
      data: {
        order
      }
    }
  }
}
