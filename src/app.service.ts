import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { MailerService } from './mailer/mailer.service';

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
   * @param pageSize 
   * @returns Home page
   */
  async home(page: number, pageSize: number, sortField: string = 'updatedAt', sortOrder: 'asc' | 'desc' = 'desc'): Promise<object> {
    const skip = (page - 1) * pageSize;
    const totalCount = await this.databaseService.food.count();

    const validSortFields = ['price', 'tag', 'ratings', 'featured', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
    }

    const trending = await this.databaseService.food.findMany({
      take: 10,
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
      skip,
      take: pageSize,
      orderBy: {
        [sortField]: sortOrder,
      },
    });


    return {
      status: 200,
      success: true,
      message: 'Successfully',
      data: {
        trending,
        restaurants,
        menu: {
          food,
          totalCount,
          page,
          pageSize,
        },
      },
    };
  }

  /**
   * 
   * @param page 
   * @param pageSize 
   * @returns Menu Page
   */
  async menu(page: number, pageSize: number, sortField: string = 'updatedAt', sortOrder: 'asc' | 'desc' = 'desc'): Promise<object> {
    const skip = (page - 1) * pageSize;
    const totalCount = await this.databaseService.food.count();

    const validSortFields = ['price', 'tag', 'ratings', 'featured', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
    }

    const featured = await this.databaseService.food.findMany({
        take: 10,
        where: {
            on_menu: true,
        },
        orderBy: {
          featured: 'desc',
        },
    });

    const food = await this.databaseService.food.findMany({
        skip,
        take: pageSize,
        where: {
            on_menu: true,
        },
        orderBy: {
            [sortField]: sortOrder,
        },
    });

    return {
        status: 200,
        success: true,
        message: 'Successfully',
        data: {
            featured,
            meal: {
                food,
                totalCount,
                page,
                pageSize,
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
