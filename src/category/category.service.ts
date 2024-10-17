import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}
  create(createCategoryDto: CreateCategoryDto) {
    const CategoryData = {
      vendor_uuid: createCategoryDto.vendor_uuid,
      name: createCategoryDto.name,
      image: createCategoryDto.image,
    };

    return this.databaseService.category.create({
      data: CategoryData as any,
    });
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.databaseService.category.update({
      where: { id },
      data: updateCategoryDto as any,
    });
  }

  remove(id: number) {
    return this.databaseService.category.delete({
      where: { id },
    });
  }
}
