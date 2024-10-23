import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
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

 /**
  * 
  * @param token 
  * @param vendor 
  * @returns Create Vendor
  */
  async create(token: string, vendor: CreateVendorDto) {
    const user = await this.MiddlewareService.decodeToken(token);
    const slug = vendor.name.replace(/\s+/g, '_');

    const account = await this.databaseService.vendor.findUnique({
      where: { slug },
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

    await this.databaseService.vendorDocuments.create({
      data: {
        uuid: createdVendor.uuid,
      }
    })

    return {
      status: 200,
      success: true,
      message: 'Vendors retrieved successfully',
      data: {
        createdVendor,
      },
    };
  }

  /**
   * 
   * @param token 
   * @returns Fect user vendors
   */
  async findAll(token: string) {
    const user = await this.MiddlewareService.decodeToken(token);

    const vendors = this.databaseService.vendor.findMany({
      where: {
        user_uuid: user.uuid
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Vendors retrieved successfully',
      data: {
        vendors,
      },
    };
  }

  /**
   * 
   * @param uuid 
   * @returns Show vendor
   */
  findOne(slug: string) {
    const vendor = this.databaseService.vendor.findUnique({
      where: { slug },
      include: {
        categories: true,
        foods: true,
      },
    });
    if(!vendor){
      throw new HttpException({
        status: 404,
        success: false,
        message: 'Vendor not found'
      }, 404)
    }

    return {
      status: 200,
      success: true,
      message: 'Vendor retrieved successfully',
      data: {
        vendor,
      },
    };
  }

  /**
   * 
   * @param token 
   * @param uuid 
   * @param updateVendorDto 
   * @returns Update Vendor
   */
  async update(token: string, uuid: string, updateVendorDto: UpdateVendorDto) {
    const user = await this.MiddlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findUnique({
      where: { uuid },
    });
    if (!vendor) {
      throw new HttpException( {
        status: 404,
        success: false,
        message: 'Vendor not found',
      }, 404)
    }else if(user.uuid !== vendor.user_uuid){
      throw new HttpException({
        status: 403,
        success: false,
        message: 'You are not authorized to upadte this vendor',
      }, 403)
    }

    await this.databaseService.vendor.update({
      where: {
        uuid
      },
      data: {
        ...updateVendorDto,
      }
    })

    return {
      status: 200,
      success: true,
      message: 'Vendor retrieved successfully',
      data: {
        vendor,
      },
    };
  }

  /**
   * 
   * @param token 
   * @param uuid 
   * @returns Delete Vendor
   */
  async remove(token: string, uuid: string) {
    const user = await this.MiddlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findUnique({
      where: { uuid },
    });
    if (!vendor) {
      throw new HttpException( {
        status: 404,
        success: false,
        message: 'Vendor not found',
      }, 404)
    }else if(user.uuid !== vendor.user_uuid){
      throw new HttpException({
        status: 403,
        success: false,
        message: 'You are not authorized to delete this vendor',
      }, 403)
    }

    await this.databaseService.vendor.update({
      where: { uuid },
      data: {
        status: 'deleted',
      }
    });

    return {
      status: 200,
      success: true,
      message: 'Vendor deleted request sent, account data will be deleted in 30days',
    };
  }
}
