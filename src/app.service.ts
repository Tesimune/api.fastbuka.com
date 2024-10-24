import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { MailerService } from './mailer/mailer.service';
import { categories } from './seeder/data/categories.data';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService
  ) {}

  /**
   * 
   * @returns Base url
   */
  index(): string {
    return 'Welcome to Fast Buka';
  }

  /**
   * 
   * @returns Health Status
   */
  health(): string {
    return 'Welcome to Fast Buka, Application running.';
  }

  /**
   * 
   * @param page 
   * @param perPage 
   * @returns Home page
   */
  async home(page: number, perPage: number, sortField: string = 'updatedAt', sortOrder: 'asc' | 'desc' = 'desc'): Promise<object> {
    const skip = (page - 1) * perPage;
    const totalCount = await this.databaseService.food.count();

    const validSortFields = ['price', 'category', 'ratings', 'featured', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
    }

    const trending = await this.databaseService.food.findMany({
      take: 10,
      include: {
        category: true
      },
    })
    
    const restaurants = await this.databaseService.vendor.findMany({
      take: 20,
      where: {
        status: "approved",
        is_online: true,
      },
      orderBy: {
        featured: 'desc'
      },
    });

    const food = await this.databaseService.food.findMany({
      skip: isNaN(skip) ? 0 : skip,
      take: perPage,
      include: {
        category: true
      },
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = Math.ceil(totalCount / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        trending,
        restaurants,
        menu: {
          food,
          pagination: {
            totalCount,
            totalPages,
            nextPage,
            previousPage,
            page,
            perPage,
          }
        },
      },
    };
  }

  /**
   * 
   * @param page 
   * @param perPage 
   * @returns Menu Page
   */
  async menu(page: number, perPage: number, sortField: string = 'updatedAt', sortOrder: 'asc' | 'desc' = 'desc'): Promise<object> {
    const skip = (page - 1) * perPage;
    const totalCount = await this.databaseService.food.count();

    const validSortFields = ['price', 'category', 'ratings', 'featured', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
    }

    const featured = await this.databaseService.food.findMany({
        take: 10,
        where: {
            on_menu: true,
        },
        include: {
          category: true
        },
        orderBy: {
          featured: 'desc',
        },
    });

    const food = await this.databaseService.food.findMany({
        skip: isNaN(skip) ? 0 : skip,
        take: perPage,
        where: {
            on_menu: true,
        },
        include: {
          category: true
        },
        orderBy: {
            [sortField]: sortOrder,
        },
    });

    const totalPages = Math.ceil(totalCount / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    return {
        status: 200,
        success: true,
        message: 'Successfully',
        data: {
            featured,
            meal: {
                food,
                pagination: {
                  totalCount,
                  totalPages,
                  nextPage,
                  previousPage,
                  page,
                  perPage,
                }
            },
        },
    };
  }


  /**
   * 
   * @returns Partners Page
   */
  async partner(): Promise<object> {
    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {},
    };
  }

  /**
   * 
   * @returns About Page
   */
  async about(): Promise<object> {
    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {},
    };
  }

  /**
   * 
   * @returns Contact Page
   */
  async contact(): Promise<{}> {
    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {},
    };
  }

  /**
   * 
   * @returns Contact Form
   */
  async form(name, email, subject, phone, message): Promise<{}> {
    const mailer = {
      email,
      subject, 
      message: `<p>Name: ${name}, <br/> Contact: ${phone} <br/> ${message}</p>`
    }
    const sent = await this.mailerService.mailer(mailer)
    if(!sent){
      throw new HttpException({
        status: 400,
        success: false,
        message: 'Unable to send message at the monment'
      }, 400)
    }
    return {
      status: 200,
      success: true,
      message: 'Mesage sent successfully',
    };
  }
}
