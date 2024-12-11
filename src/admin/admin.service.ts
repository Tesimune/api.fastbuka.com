import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService,
  ) {}

  private async getMonthlyRevenueForYear(year?: number) {
    const currentYear = year ? year : new Date().getFullYear();
    const monthlyRevenue = Array(12).fill(0);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    for (let month = 0; month < 12; month++) {
      const monthlyOrders = await this.databaseService.order.findMany({
        where: {
          payment_status: 'completed',
          createdAt: {
            gte: new Date(currentYear, month, 1),
            lt: new Date(currentYear, month + 1, 1),
          },
        },
      });
      monthlyRevenue[month] = monthlyOrders.reduce(
        (acc, curr) => acc + curr.paid_amount,
        0,
      );
    }

    const monthlyRevenueWithNames = monthlyRevenue.map((revenue, index) => ({
      month: monthNames[index],
      revenue: revenue,
    }));

    return monthlyRevenueWithNames;
  }

  /**
   *  Admin Dashboard
   * @param token
   * @returns
   */
  async dashboard(token?: string, year?: number) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized',
        },
        419,
      );
    }

    const users = async (role: string) =>
      await this.databaseService.user.findMany({
        where: { role: role },
      });

    const vendors = async (status: string) =>
      await this.databaseService.vendor.findMany({
        where: { status: status },
      });

    const riders = async (status: string) =>
      await this.databaseService.rider.findMany({
        where: { status: status },
      });

    const orders = async (status: string) =>
      await this.databaseService.order.findMany({
        where: { order_status: status },
      });

    const monthlyRevenue = await this.getMonthlyRevenueForYear();
    const totalYearlyRevenue = monthlyRevenue.reduce(
      (acc, curr) => acc + curr.revenue,
      0,
    );

    const cards = [
      {
        title: 'Admins',
        value: (await users('admin')).length,
      },
      {
        title: 'Users',
        value: (await users('user')).length,
      },
      {
        title: 'Riders',
        value: (await riders('approved')).length,
      },
      {
        title: 'Vendors',
        value: (await vendors('approved')).length,
      },
      {
        title: 'Orders',
        value: (await orders('pending')).length,
      },
      {
        title: 'Revenue',
        value: totalYearlyRevenue,
      },
    ];

    return {
      status: 200,
      success: true,
      message: 'Found',
      data: {
        cards,
        monthlyRevenue: await this.getMonthlyRevenueForYear(year),
      },
    };
  }

  /**
   * Get Users/User
   * @param token
   * @param user_uuid
   * @param page
   * @param limit
   * @returns
   */
  async users(
    token: string,
    user_uuid?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unathorized',
        },
        419,
      );
    }
    if (user_uuid) {
      const user = await this.databaseService.user.findUnique({
        where: {
          uuid: user_uuid,
        },
        include: {
          profile: true,
          vendors: true,
          rider: true,
        },
      });
      if (user) {
        return {
          status: 200,
          success: true,
          message: 'User',
          data: {
            user: user,
          },
        };
      } else {
        throw new HttpException(
          {
            status: 404,
            success: false,
            message: `user with uuid: ${user_uuid} wasn't found`,
          },
          404,
        );
      }
    } else {
      const users = await this.databaseService.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          profile: true,
        },
      });

      const totalUsers = await this.databaseService.user.count();

      return {
        status: 200,
        success: true,
        message: 'Users',
        data: {
          users,
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
      };
    }
  }

  /**
   *
   * @param token
   * @param user_uuid
   * @returns
   */
  async role(token: string, user_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized',
        },
        419,
      );
    }

    const user = await this.databaseService.user.findUnique({
      where: { uuid: user_uuid },
    });

    const newRole = user.role === 'user' ? 'admin' : 'user';
    await this.databaseService.user.update({
      where: {
        uuid: user_uuid,
      },
      data: {
        role: newRole,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'User role updated',
      data: {
        user: user,
      },
    };
  }

  /**
   *
   * @param token
   * @param user_uuid
   * @param status
   * @returns
   */
  async userStatus(token: string, user_uuid: string, status: string) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized',
        },
        419,
      );
    }

    const user = this.databaseService.user.update({
      where: {
        uuid: user_uuid,
      },
      data: {
        status: status,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'User not found',
        },
        404,
      );
    }

    return {
      status: 200,
      success: true,
      message: 'Status updated',
    };
  }

  /**
   * Get Vendors/vendor
   * @param token
   * @param vendor_uuid
   * @param status
   * @param page
   * @param limit
   * @returns
   */
  async vendors(
    token: string,
    vendor_uuid?: string,
    status?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized',
        },
        419,
      );
    }

    if (vendor_uuid) {
      const vendor = this.databaseService.vendor.findUnique({
        where: {
          uuid: vendor_uuid,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      });

      if (!vendor) {
        throw new HttpException(
          {
            status: 404,
            success: false,
            message: `Vendor with uuid: ${vendor_uuid} wasn't found`,
          },
          404,
        );
      }

      return {
        status: 200,
        success: true,
        message: 'vendor',
        data: {
          vendor: vendor,
        },
      };
    } else {
      let vendors = [];
      if (status) {
        vendors = await this.databaseService.vendor.findMany({
          where: {
            status,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        });
      } else {
        vendors = await this.databaseService.vendor.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        });
      }

      const totalVendors = await this.databaseService.vendor.count();

      return {
        status: 200,
        success: true,
        message: 'Vendors fetched successfully',
        data: {
          vendors,
          total: totalVendors,
          page,
          limit,
          totalPages: Math.ceil(totalVendors / limit),
        },
      };
    }
  }

  /**
   * Approve vendor
   * @param token
   * @param vendor_uuid
   * @returns
   */
  async approveVendor(token: string, vendor_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized',
        },
        419,
      );
    }

    const vendor = await this.databaseService.vendor.update({
      where: { uuid: vendor_uuid },
      data: { status: 'approved' },
    });

    return {
      status: 200,
      success: true,
      message: 'Vendor approved successfully',
      data: {
        vendor: vendor,
      },
    };
  }

  /**
   * Get Riders/Rider
   * @param token
   * @param rider_uuid
   * @param status
   * @param page
   * @param limit
   * @returns
   */
  async riders(
    token: string,
    rider_uuid?: string,
    status?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized',
        },
        419,
      );
    }

    if (rider_uuid) {
      const rider = this.databaseService.rider.findUnique({
        where: {
          uuid: rider_uuid,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      });

      if (!rider) {
        throw new HttpException(
          {
            status: 404,
            success: false,
            message: `Vendor with uuid: ${rider_uuid} wasn't found`,
          },
          404,
        );
      }

      return {
        status: 200,
        success: true,
        message: 'rider',
        data: {
          rider: rider,
        },
      };
    } else {
      let riders = [];
      if (status) {
        riders = await this.databaseService.rider.findMany({
          where: {
            status,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        });
      } else {
        riders = await this.databaseService.rider.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        });
      }

      const totalRiders = await this.databaseService.rider.count();

      return {
        status: 200,
        success: true,
        message: 'riders fetched successfully',
        data: {
          riders,
          total: totalRiders,
          page,
          limit,
          totalPages: Math.ceil(totalRiders / limit),
        },
      };
    }
  }

  /**
   * Approve rider
   * @param token
   * @param vendor_uuid
   * @returns
   */
  async approveRider(token: string, rider_uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized',
        },
        419,
      );
    }

    const rider = await this.databaseService.rider.update({
      where: { uuid: rider_uuid },
      data: { status: 'approved' },
    });

    return {
      status: 200,
      success: true,
      message: 'Rider approved successfully',
      data: {
        rider: rider,
      },
    };
  }

  /**
   * Get Transactions/Transaction
   * @param token
   * @param transaction_id
   * @param page
   * @param limit
   * @returns
   */
  async transactions(
    token: string,
    transaction_id?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Unauthorized access',
        },
        419,
      );
    }

    if (transaction_id) {
      const order = await this.databaseService.order.findUnique({
        where: {
          uuid: transaction_id,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          vendor: true,
          rider: true,
        },
      });

      if (order) {
        return {
          status: 200,
          success: true,
          message: 'Transaction fetched successfully',
          data: {
            transaction: order,
          },
        };
      }
    }

    let transactions = [];
    transactions = await this.databaseService.order.findMany({
      where: {
        payment_status: 'completed',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        vendor: true,
        rider: true,
      },
    });

    const totalTransactions = await this.databaseService.order.count({
      where: {
        payment_status: 'completed',
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Transactions fetched successfully',
      data: {
        transactions,
        total: totalTransactions,
        page,
        limit,
        totalPages: Math.ceil(totalTransactions / limit),
      },
    };
  }
}
