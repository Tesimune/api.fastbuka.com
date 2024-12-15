import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService,
  ) {}

  async create(token: string, createOrderDto: CreateOrderDto) {
    try {
      const auth = await this.middlewareService.decodeToken(token);
      let order = null;
      let totalAmount = 0;
      let outOfStockItems = [];

      for (const item of createOrderDto.cartItems) {
        const food = await this.databaseService.food.findUnique({
          where: {
            uuid: item.food_uuid,
          },
        });

        if (food.stock < item.quantity) {
          outOfStockItems.push(food);
          continue;
        }

        totalAmount += food.price * item.quantity;
        order = await this.databaseService.order.findFirst({
          where: {
            vendor_uuid: food.vendor_uuid,
            user_uuid: auth.uuid,
            order_status: 'pending',
          },
        });

        if (order) {
          order = await this.databaseService.order.update({
            where: {
              uuid: order.uuid,
            },
            data: {
              total_amount: ++totalAmount,
            },
          });
        } else {
          const orderNumber = `${auth.username.slice(0, 2).toUpperCase()}${food.vendor_uuid.slice(0, 2).toUpperCase()}${Math.floor(10000 + Math.random() * 90000)}`;
          order = await this.databaseService.order.create({
            data: {
              user_uuid: auth.uuid,
              vendor_uuid: food.uuid,
              order_number: orderNumber,
              total_amount: totalAmount,
              delivery_name: createOrderDto.delivery_name,
              delivery_email: createOrderDto.delivery_email,
              delivery_contact: createOrderDto.delivery_contact,
              delivery_address: createOrderDto.delivery_address,
            },
          });
        }

        await this.databaseService.orderItem.create({
          data: {
            order_uuid: order.uuid,
            food_uuid: food.uuid,
            price: food.price,
            quantity: item.quantity,
          },
        });
      }

      let outOfStockMessage = null;
      if (outOfStockItems.length > 0) {
        outOfStockMessage = ',Some items are out of stock';
      }

      return {
        status: 200,
        success: true,
        message: `Order created successfully ${outOfStockItems}`,
        data: {
          order,
          outOfStockItems,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status ?? 500,
          success: false,
          message: error.message ?? 'Internal server',
        },
        error.status ?? 500,
      );
    }
  }

  /**
   * Fetch orders (user)
   * @param token
   * @param order_status
   * @returns
   */
  async findAll(token: string, order_status?: string) {
    try {
      const auth = await this.middlewareService.decodeToken(token);

      const orders = await this.databaseService.order.findMany({
        where: {
          user_uuid: auth.uuid,
          ...(order_status ? { order_status } : {}),
        },
        include: {
          orderItems: {
            include: {
              food: true,
            },
          },
          vendor: true,
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Orders retrieved successfully',
        data: {
          orders,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status ?? 500,
          success: false,
          message: error.message ?? 'Internal server',
        },
        error.status ?? 500,
      );
    }
  }

  /**
   * Fetch Orders (Vendor)
   * @param token
   * @param vendor_uuid
   * @param order_status
   * @returns
   */
  async findVendOrders(
    token: string,
    vendor_uuid: string,
    order_status?: string,
  ) {
    try {
      const auth = await this.middlewareService.decodeToken(token);

      const vendor = await this.databaseService.vendor.findFirst({
        where: {
          uuid: vendor_uuid,
          user_uuid: auth.uuid,
        },
      });

      if (!vendor) {
        throw new HttpException(
          {
            status: 403,
            success: false,
            message: 'Only vendors can access this endpoint',
          },
          403,
        );
      }

      const orders = await this.databaseService.order.findMany({
        where: {
          vendor_uuid: vendor.uuid,
          ...(order_status ? { order_status } : {}),
        },
        include: {
          orderItems: {
            include: {
              food: true,
            },
          },
          user: {
            select: {
              email: true,
              contact: true,
              username: true,
            },
          },
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Vendor orders retrieved successfully',
        data: {
          orders,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status ?? 500,
          success: false,
          message: error.message ?? 'Internal server',
        },
        error.status ?? 500,
      );
    }
  }

  /**
   * Show order
   * @param token
   * @param order_uuid
   * @returns
   */
  async findOne(token: string, order_uuid: string) {
    try {
      const auth = await this.middlewareService.decodeToken(token);

      const order = await this.databaseService.order.findUnique({
        where: {
          uuid: order_uuid,
          user_uuid: auth.uuid,
        },
        include: {
          orderItems: {
            include: {
              food: true,
            },
          },
          vendor: true,
        },
      });
      if (!order) {
        throw new HttpException(
          {
            status: 404,
            success: false,
            message: 'Order not found',
          },
          404,
        );
      }

      return {
        status: 200,
        success: true,
        message: 'Order retrieved successfully',
        data: {
          order,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status ?? 500,
          success: false,
          message: error.message ?? 'Internal server',
        },
        error.status ?? 500,
      );
    }
  }
}
