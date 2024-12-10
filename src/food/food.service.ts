import { HttpException, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { DatabaseService } from 'src/database/database.service';
import { Express } from 'express';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { StorageService } from 'src/storage/storage.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FoodService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    token,
    vendor_slug: string,
    createFoodDto: CreateFoodDto,
    image?: Express.Multer.File,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        slug: vendor_slug,
        user_uuid: auth.uuid,
      },
    });
    if (!vendor) {
      throw new HttpException(
        {
          status: 401,
          success: false,
          message: 'Unauthorized',
        },
        401,
      );
    }
    const uuid = randomUUID();
    let bucket: string;
    if (createFoodDto.imageUrl) {
      bucket = createFoodDto.imageUrl;
    } else if (image instanceof File) {
      bucket = await this.storageService.bucket(token, `food_${uuid}`, image);
    } else {
      bucket = null;
    }

    const foodData = {
      uuid: uuid,
      vendor_uuid: vendor.uuid,
      category_uuid: createFoodDto.category_uuid,
      description: createFoodDto.description,
      image: bucket,
      name: createFoodDto.name,
      price: createFoodDto.price,
      discount: createFoodDto.discount,
      processing_time: createFoodDto.processing_time,
      ready_made: createFoodDto.ready_made,
    };
    const food = this.databaseService.food.create({
      data: foodData as any,
    });

    return {
      status: 200,
      success: true,
      message: 'Food created successfully',
      data: {
        food: food,
      },
    };
  }

  async findAll(vendor_slug: string) {
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        slug: vendor_slug,
      },
    });
    if (!vendor) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Vendor Does not exist',
        },
        404,
      );
    }

    const foods = this.databaseService.food.findMany({
      where: {
        vendor_uuid: vendor.uuid,
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Food retrieved successfully',
      data: {
        foods,
      },
    };
  }

  async findOne(vendor_slug: string, uuid: string) {
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        slug: vendor_slug,
      },
    });
    if (!vendor) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Vendor Does not exist',
        },
        404,
      );
    }

    const food = await this.databaseService.food.findUnique({
      where: { uuid, vendor_uuid: vendor.uuid },
    });
    if (!food) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'food not found, or deleted',
        },
        404,
      );
    }
    return {
      status: 200,
      success: true,
      message: 'Food retrieved successfully',
      data: {
        food,
      },
    };
  }

  async update(
    token: string,
    vendor_slug: string,
    uuid: string,
    updateFoodDto: UpdateFoodDto,
    image?: Express.Multer.File,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        slug: vendor_slug,
        user_uuid: auth.uuid,
      },
    });
    if (!vendor) {
      throw new HttpException(
        {
          status: 401,
          success: false,
          message: 'Unauthorized',
        },
        401,
      );
    }

    const existingFood = await this.databaseService.food.findUnique({
      where: { uuid, vendor_uuid: vendor.uuid },
    });

    let bucket: string;
    if (updateFoodDto.imageUrl) {
      bucket = updateFoodDto.imageUrl;
    } else if (image instanceof File) {
      bucket = await this.storageService.bucket(token, `food_${uuid}`, image);
    } else {
      bucket = existingFood?.image || null;
    }

    const foodData = {
      image: bucket,
      ...updateFoodDto,
    };
    const food = this.databaseService.food.update({
      where: { uuid },
      data: foodData as any,
    });
    return {
      status: 200,
      success: true,
      message: 'Food updated successfully',
      data: {
        food,
      },
    };
  }

  async remove(token: string, vendor_slug: string, uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        slug: vendor_slug,
        user_uuid: auth.uuid,
      },
    });
    if (!vendor) {
      throw new HttpException(
        {
          status: 401,
          success: false,
          message: 'Unauthorized',
        },
        401,
      );
    }

    this.databaseService.food.delete({
      where: { uuid, vendor_uuid: vendor.uuid },
    });
    return {
      status: 200,
      success: true,
      message: 'Food deleted successfully',
    };
  }
}
