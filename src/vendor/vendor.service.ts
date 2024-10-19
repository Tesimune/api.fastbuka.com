import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

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

    return {
      status: 200,
      success: true,
      message: 'Vendors retrieved successfully',
      data: {
        createdVendor
      } 
    }
  }

  findAll() {
    const vendors = this.databaseService.vendor.findMany();
    return {
      status: 200,
      success: true,
      message: 'Vendors retrieved successfully',
      data: {
        vendors
      } 
    }
  }

  findOne(uuid: string) {
    const vendor = this.databaseService.vendor.findUnique({
      where: { uuid },
    });

    return {
      status: 200,
      success: true,
      message: 'Vendor retrieved successfully',
      data: {
        vendor
      } 
    }
  }

  update(uuid: string, updateVendorDto: UpdateVendorDto) {
    const vendor = this.databaseService.vendor.findUnique({
      where: { uuid },
    });

    return {
      status: 200,
      success: true,
      message: 'Vendor retrieved successfully',
      data: {
        vendor
      } 
    }
  }

  remove(uuid: string) {
    this.databaseService.vendor.delete({
      where: { uuid },
    });

    const vendor = this.databaseService.vendor.findUnique({
      where: { uuid },
    });

    return {
      status: 200,
      success: true,
      message: 'Vendor deleted successfully',
    }
  }
}
