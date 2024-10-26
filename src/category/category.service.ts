import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { StorageService } from 'src/storage/storage.service';
import { randomUUID } from 'crypto';
import { retry } from 'rxjs';


@Injectable()
export class CategoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService,
    private readonly storageService: StorageService
  ) {}
  
  async create(token, vendor_slug, createCategoryDto: CreateCategoryDto, image: Express.Multer.File) {
    const auth = await this.middlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        uuid: vendor_slug,
        user_uuid: auth.uuid
      }
    });
    if(!vendor){
      throw new HttpException({
        status: 401,
        success: false,
        message: 'Unauthorized'
      }, 401)
    }

    const uuid = randomUUID();
    const bucket = await this.storageService.bucket(token, uuid, image)

    const CategoryData = {
      uuid,
      vendor_uuid: createCategoryDto.vendor_uuid,
      name: createCategoryDto.name,
      image: bucket,
    };

    await this.databaseService.category.create({
      data: CategoryData as any,
    });

    return {
      status: 200,
      success: true,
      message: 'Created'
    }
  }

  async findAll(vendor_slug: string) {
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        uuid: vendor_slug,
      }
    });
    if(!vendor){
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Unauthorized'
      }, 404)
    }

    const categories = await this.databaseService.category.findMany({
      where: {
        vendor_uuid: vendor.uuid
      }
    });

    return {
      status: 200,
      success: true,
      message: 'Found',
      data: {categories}
    }
  }

  async findOne(vendor_slug: string, uuid: string) {
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        uuid: vendor_slug,
      }
    });
    if(!vendor){
      throw new HttpException({
        status: 401,
        success: false,
        message: 'Unauthorized'
      }, 401)
    }

    const category = await this.databaseService.category.findFirst({
      where: {
        uuid,
        vendor_uuid: vendor.uuid
      }
    })

    if(!category){
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Category not found'
      }, 404)
    }

    return {
      status: 200,
      success: true,
      message: 'Found',
      data: {
        category
      }
    };
  }

  async update(token: string, vendor_slug: string, uuid: string, updateCategoryDto: UpdateCategoryDto, image: Express.Multer.File) {
    const auth = await this.middlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        uuid: vendor_slug,
        user_uuid: auth.uuid
      }
    });
    if(!vendor){
      throw new HttpException({
        status: 401,
        success: false,
        message: 'Unauthorized'
      }, 401)
    }

    const bucket = await this.storageService.bucket(token, uuid, image)

    const CategoryData = {
      uuid,
      name: updateCategoryDto.name,
      image: bucket,
    };

    const category = await this.databaseService.category.update({
      where: { uuid },
      data: CategoryData as any,
    });

    if(!category){
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Category not found'
      }, 404)
    }
    return {
      status: 200,
      success: true,
      message: 'Updated',
      data: {
        category
      }
    }
  }

  async remove(token: string, vendor_slug: string, uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findFirst({
      where: {
        uuid: vendor_slug,
        user_uuid: auth.uuid
      }
    });
    if(!vendor){
      throw new HttpException({
        status: 401,
        success: false,
        message: 'Unauthorized'
      }, 401)
    }

    await this.databaseService.category.delete({
      where: { uuid, vendor_uuid: vendor.uuid },
    });

    return {
      status: 200,
      success: true,
      message: 'Deleted',
    }
  }
}
