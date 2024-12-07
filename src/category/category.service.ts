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
    private readonly storageService: StorageService,
  ) {}

  async create(
    token,
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 403,
          success: false,
          message: 'Unauthorized access',
        },
        403,
      );
    }
    const uuid = randomUUID();
    let bucket: string;
    if (createCategoryDto.imageUrl) {
      bucket = createCategoryDto.imageUrl;
    } else {
      bucket = await this.storageService.bucket(token, uuid, image);
    }

    const CategoryData = {
      uuid,
      name: createCategoryDto.name,
      image: bucket,
    };

    await this.databaseService.category.create({
      data: CategoryData as any,
    });

    return {
      status: 200,
      success: true,
      message: 'Created',
    };
  }

  async findAll() {
    const categories = await this.databaseService.category.findMany();
    return {
      status: 200,
      success: true,
      message: 'Found',
      data: { categories },
    };
  }

  async findOne(uuid: string) {
    const category = await this.databaseService.category.findFirst({
      where: {
        uuid,
      },
    });

    if (!category) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Category not found',
        },
        404,
      );
    }

    return {
      status: 200,
      success: true,
      message: 'Found',
      data: {
        category,
      },
    };
  }

  async update(
    token: string,
    uuid: string,
    updateCategoryDto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 403,
          success: false,
          message: 'Unauthorized access',
        },
        403,
      );
    }
    const existingCategory = await this.databaseService.category.findUnique({
      where: { uuid },
    });

    let bucket: string;
    if (updateCategoryDto.imageUrl) {
      bucket = updateCategoryDto.imageUrl;
    } else if (image instanceof File) {
      bucket = await this.storageService.bucket(
        token,
        `category_${uuid}`,
        image,
      );
    } else {
      bucket = existingCategory?.image || null;
    }

    const CategoryData = {
      uuid,
      name: updateCategoryDto.name,
      image: bucket,
    };

    const category = await this.databaseService.category.update({
      where: { uuid },
      data: CategoryData as any,
    });

    if (!category) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Category not found',
        },
        404,
      );
    }
    return {
      status: 200,
      success: true,
      message: 'Updated',
      data: {
        category,
      },
    };
  }

  async remove(token: string, uuid: string) {
    const auth = await this.middlewareService.decodeToken(token);
    if (auth.role !== 'admin') {
      throw new HttpException(
        {
          status: 403,
          success: false,
          message: 'Unauthorized access',
        },
        403,
      );
    }
    await this.databaseService.category.delete({
      where: { uuid },
    });

    return {
      status: 200,
      success: true,
      message: 'Deleted',
    };
  }
}
