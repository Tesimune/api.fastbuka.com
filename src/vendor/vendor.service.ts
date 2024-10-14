import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';

@Injectable()
export class VendorService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly MiddlewareService: MiddlewareService,
  ) {}

  async create(token: string, vendor: CreateVendorDto) {
    const user = await this.MiddlewareService.decodeToken(token);

    const account = await this.databaseService.vendor.findUnique({
      where: { name: vendor.name },
    });

    if (account) {
      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: 'Vendor name is taken',
      });
    }

    const createdVendor = await this.databaseService.vendor.create({
      data: {
        user_uuid: user.uuid,
        ...vendor,
      },
    });

    return createdVendor;
  }

  findAll() {
    return this.databaseService.vendor.findMany();
  }

  findOne(id: number) {
    return this.databaseService.vendor.findUnique({
      where: { id },
    });
  }

  // update(id: number, updateVendorDto: UpdateVendorDto) {
  //   return `This action updates a #${id} vendor`;
  // }

  remove(id: number) {
    return this.databaseService.vendor.delete({
      where: { id },
    });
  }
}
