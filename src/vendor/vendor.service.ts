import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    return `This action returns all vendor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendor: Prisma.VendorCreateInput) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
