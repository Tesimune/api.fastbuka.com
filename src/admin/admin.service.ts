import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService,
  ) {}

  async dashboard(token?: string) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException({
        status: 419,
        success: false,
        message: 'Unauthorized',
      }, 419);
    }

    const users = async (role: string) =>
      (await this.databaseService.user.findMany({
        where: { role: role },
      })).length;
    
    const revenue = (
      await this.databaseService.order.findMany({
        where: { payment_status: 'paid' },
      })
    ).reduce((acc, curr) => acc + curr.paid_amount, 0);

    const monthlyRevenue = await this.getMonthlyRevenueForYear();
    const totalYearlyRevenue = monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0);

    const orders = async (status: string) =>
      await this.databaseService.order.findMany({
        where: { order_status: status },
      });

    const cards = [
      {
        title: 'Revenue',
        value: revenue,
      },
      {
        title: 'Revenue',
        value: totalYearlyRevenue,
      },
      {
        title: 'Users',
        value: users('user'),
      },
      {
        title: 'Riders',
        value: users('rider'),
      },
      {
        title: 'Vendors',
        value: users('vendor'),
      },
      {
        title: 'Admins',
        value: users('admin'),
      },
      {
        title: 'Orders',
        value: (await orders('pending')).length,
      },
    ];

    return {
      status: 200,
      success: true,
      message: 'Found',
      data: {
        cards,
        orders: await orders('pending'),
        monthlyRevenue: await this.getMonthlyRevenueForYear(),
      },
    };
  }

  private async getMonthlyRevenueForYear() {
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = Array(12).fill(0);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let month = 0; month < 12; month++) {
      const monthlyOrders = await this.databaseService.order.findMany({
        where: {
          payment_status: 'paid',
          createdAt: {
            gte: new Date(currentYear, month, 1),
            lt: new Date(currentYear, month + 1, 1),
          },
        },
      });
      monthlyRevenue[month] = monthlyOrders.reduce((acc, curr) => acc + curr.paid_amount, 0);
    }

    const monthlyRevenueWithNames = monthlyRevenue.map((revenue, index) => ({
      month: monthNames[index],
      revenue: revenue
    }));

    return monthlyRevenueWithNames;
  }
}
