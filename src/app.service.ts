import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { MailerService } from './mailer/mailer.service';
import { categories } from './seeder/data/categories.data';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
  ) {}

  private calculateDistance(
    userLongitude: number,
    userLatitude: number,
    vendorLongitude: number,
    vendorLatitude: number,
  ): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    const dLat = toRadians(vendorLatitude - userLatitude);
    const dLon = toRadians(vendorLongitude - userLongitude);

    const userLatRad = toRadians(userLatitude);
    const vendorLatRad = toRadians(vendorLatitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLatRad) *
        Math.cos(vendorLatRad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c; // Distance in kilometers
  }

  private filterAndSortByDistanceFood(
    foodItems: any[],
    userLongitude: number,
    userLatitude: number,
    maxDistanceMiles: number = 20,
  ): any[] {
    const maxDistanceKm = maxDistanceMiles * 1.60934;

    return foodItems
      .map((item) => {
        const vendor = item.vendor;
        const distance = this.calculateDistance(
          userLongitude,
          userLatitude,
          vendor.longitude,
          vendor.latitude,
        );
        return { ...item, distance };
      })
      .filter((item) => item.distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance);
  }

  private filterAndSortByDistanceVendor(
    vendors: any[],
    userLongitude: number,
    userLatitude: number,
  ): any[] {
    const maxDistanceMiles = 20;
    const milesToKm = 1.60934;

    return vendors
      .map((vendor) => {
        const distanceKm = this.calculateDistance(
          userLongitude,
          userLatitude,
          vendor.longitude,
          vendor.latitude,
        );
        return { ...vendor, distanceMiles: distanceKm / milesToKm };
      })
      .filter((vendor) => vendor.distanceMiles <= maxDistanceMiles)
      .sort((a, b) => a.distanceMiles - b.distanceMiles);
  }

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
   * @param longitude
   * @param latitude
   * @param page
   * @param perPage
   * @param sortField
   * @param sortOrder
   * @returns
   */
  async vendors(
    longitude: number,
    latitude: number,
    page: number,
    perPage: number,
    sortField: string = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<object> {
    try {
      const validSortFields = ['ratings', 'featured', 'createdAt', 'updatedAt'];
      if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
      }

      const allVendors = await this.databaseService.vendor.findMany({
        where: {
          status: 'approved',
          is_online: true,
        },
      });

      let sortedVendors = allVendors;
      if (longitude && latitude) {
        sortedVendors = this.filterAndSortByDistanceVendor(
          allVendors,
          longitude,
          latitude,
        );
      } else {
        sortedVendors.sort((a, b) => {
          if (sortOrder === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
          }
          return a[sortField] < b[sortField] ? 1 : -1;
        });
      }

      const totalCount = sortedVendors.length;
      const totalPages = Math.ceil(totalCount / perPage);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedVendors = sortedVendors.slice(start, end);

      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;

      return {
        status: 200,
        success: true,
        message: 'Successfully retrieved vendors',
        data: {
          vendors: paginatedVendors,
          pagination: {
            totalCount,
            totalPages,
            nextPage,
            previousPage,
            page,
            perPage,
          },
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
   *
   * @param longitude
   * @param latitude
   * @param page
   * @param perPage
   * @param sortField
   * @param sortOrder
   * @returns
   */
  async featured(
    longitude: number,
    latitude: number,
    page: number,
    perPage: number,
    sortField: string = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<object> {
    try {
      const validSortFields = ['ratings', 'featured', 'createdAt', 'updatedAt'];
      if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
      }

      const allVendors = await this.databaseService.vendor.findMany({
        where: {
          status: 'approved',
          is_online: true,
        },
        orderBy: {
          featured: 'desc',
        },
      });

      let sortedVendors = allVendors;
      if (longitude && latitude) {
        sortedVendors = this.filterAndSortByDistanceVendor(
          allVendors,
          longitude,
          latitude,
        );
      } else {
        sortedVendors.sort((a, b) => {
          if (sortOrder === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
          }
          return a[sortField] < b[sortField] ? 1 : -1;
        });
      }

      const totalCount = sortedVendors.length;
      const totalPages = Math.ceil(totalCount / perPage);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedVendors = sortedVendors.slice(start, end);

      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;

      return {
        status: 200,
        success: true,
        message: 'Successfully retrieved vendors',
        data: {
          vendors: paginatedVendors,
          pagination: {
            totalCount,
            totalPages,
            nextPage,
            previousPage,
            page,
            perPage,
          },
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
   *
   * @param longitude
   * @param latitude
   * @param page
   * @param perPage
   * @param sortField
   * @param sortOrder
   * @returns
   */
  async food(
    longitude: number,
    latitude: number,
    page: number,
    perPage: number,
    sortField: string = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<object> {
    try {
      const validSortFields = [
        'price',
        'category',
        'ratings',
        'featured',
        'createdAt',
        'updatedAt',
      ];
      if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
      }

      const allFood = await this.databaseService.food.findMany({
        where: {
          on_menu: true,
        },
        include: {
          category: true,
          vendor: true,
        },
      });

      let sortedFood = allFood;
      if (longitude && latitude) {
        sortedFood = this.filterAndSortByDistanceFood(
          allFood,
          longitude,
          latitude,
        );
      } else {
        sortedFood.sort((a, b) => {
          if (sortOrder === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
          }
          return a[sortField] < b[sortField] ? 1 : -1;
        });
      }

      const totalCount = sortedFood.length;
      const totalPages = Math.ceil(totalCount / perPage);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedFood = sortedFood.slice(start, end);

      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;

      return {
        status: 200,
        success: true,
        message: 'Successfully',
        data: {
          food: paginatedFood,
          pagination: {
            totalCount,
            totalPages,
            nextPage,
            previousPage,
            page,
            perPage,
          },
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
   *
   * @param longitude
   * @param latitude
   * @param page
   * @param perPage
   * @param sortField
   * @param sortOrder
   * @returns
   */
  async trending(
    longitude: number,
    latitude: number,
    page: number,
    perPage: number,
    sortField: string = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<object> {
    try {
      const validSortFields = [
        'price',
        'category',
        'ratings',
        'featured',
        'createdAt',
        'updatedAt',
      ];
      if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
      }

      const allFood = await this.databaseService.food.findMany({
        where: {
          on_menu: true,
        },
        include: {
          category: true,
          vendor: true,
        },
      });

      let sortedFood = allFood;
      if (longitude && latitude) {
        sortedFood = this.filterAndSortByDistanceFood(
          allFood,
          longitude,
          latitude,
        );
      } else {
        sortedFood.sort((a, b) => {
          if (sortOrder === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
          }
          return a[sortField] < b[sortField] ? 1 : -1;
        });
      }

      const totalCount = sortedFood.length;
      const totalPages = Math.ceil(totalCount / perPage);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedFood = sortedFood.slice(start, end);

      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;

      return {
        status: 200,
        success: true,
        message: 'Successfully',
        data: {
          food: paginatedFood,
          pagination: {
            totalCount,
            totalPages,
            nextPage,
            previousPage,
            page,
            perPage,
          },
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
   *
   * @returns
   */
  async categories() {
    try {
      const categories = await this.databaseService.category.findMany();
      return {
        status: 200,
        success: true,
        message: 'Found',
        data: { categories },
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
   *
   * @param page
   * @param perPage
   * @returns Home page
   */
  async home(
    page: number,
    perPage: number,
    sortField: string = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<object> {
    try {
      const skip = (page - 1) * perPage;
      const totalCount = await this.databaseService.food.count();

      const validSortFields = [
        'price',
        'category',
        'ratings',
        'featured',
        'createdAt',
        'updatedAt',
      ];
      if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
      }

      const trending = await this.databaseService.food.findMany({
        take: 10,
        include: {
          category: true,
          vendor: true,
        },
      });

      const restaurants = await this.databaseService.vendor.findMany({
        take: 20,
        where: {
          status: 'approved',
          is_online: true,
        },
        orderBy: {
          featured: 'desc',
        },
      });

      const food = await this.databaseService.food.findMany({
        skip: isNaN(skip) ? 0 : skip,
        take: perPage,
        include: {
          category: true,
          vendor: true,
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
            },
          },
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
   *
   * @param page
   * @param perPage
   * @returns Menu Page
   */
  async menu(
    page: number,
    perPage: number,
    sortField: string = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<object> {
    try {
      const skip = (page - 1) * perPage;
      const totalCount = await this.databaseService.food.count();

      const validSortFields = [
        'price',
        'category',
        'ratings',
        'featured',
        'createdAt',
        'updatedAt',
      ];
      if (!validSortFields.includes(sortField)) {
        sortField = 'updatedAt';
      }

      const featured = await this.databaseService.food.findMany({
        take: 10,
        where: {
          on_menu: true,
        },
        include: {
          category: true,
          vendor: true,
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
          category: true,
          vendor: true,
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
            },
          },
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
   *
   * @returns Partners Page
   */
  async partner(): Promise<object> {
    try {
      return {
        status: 200,
        success: true,
        message: 'Successfully',
        data: {},
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
   *
   * @returns About Page
   */
  async about(): Promise<object> {
    try {
      return {
        status: 200,
        success: true,
        message: 'Successfully',
        data: {},
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
   *
   * @returns Contact Page
   */
  async contact(): Promise<{}> {
    try {
      return {
        status: 200,
        success: true,
        message: 'Successfully',
        data: {},
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
   *
   * @returns Contact Form
   */
  async form(name, email, subject, phone, message): Promise<{}> {
    try {
      const mailer = {
        email,
        subject,
        message: `<p>Name: ${name}, <br/> Contact: ${phone} <br/> ${message}</p>`,
      };
      const sent = await this.mailerService.mailer(mailer);
      if (!sent) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Unable to send message at the monment',
          },
          400,
        );
      }
      return {
        status: 200,
        success: true,
        message: 'Mesage sent successfully',
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
