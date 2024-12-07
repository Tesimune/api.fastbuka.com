import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class VendorService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly MiddlewareService: MiddlewareService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Create a new vendor
   * @param token
   * @param vendor
   * @returns Created Vendor
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
        slug,
        ...vendor,
      },
    });

    // Create a default VendorDocument record
    await this.databaseService.vendorDocuments.create({
      data: {
        uuid: createdVendor.uuid,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Vendor created successfully',
      data: {
        createdVendor,
      },
    };
  }

  /**
   * Fetch all vendors for a user
   * @param token
   * @returns List of user vendors
   */
  async findAll(token: string) {
    const user = await this.MiddlewareService.decodeToken(token);

    const vendors = await this.databaseService.vendor.findMany({
      where: {
        user_uuid: user.uuid,
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
   * Show details of a single vendor by slug
   * @param slug
   * @returns Vendor details
   */
  async findOne(slug: string) {
    const vendor = await this.databaseService.vendor.findUnique({
      where: { slug },
      include: {
        foods: true,
      },
    });

    if (!vendor) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: `Vendor with slug "${slug}" not found`,
        },
        404,
      );
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
   * Update an existing vendor
   * @param token
   * @param uuid
   * @param updateVendorDto
   * @returns Updated Vendor
   */
  async update(
    token: string,
    uuid: string,
    updateVendorDto: UpdateVendorDto,
    profile?: Express.Multer.File,
    cover?: Express.Multer.File,
    id_upload?: Express.Multer.File,
    business_upload?: Express.Multer.File,
  ) {
    const user = await this.MiddlewareService.decodeToken(token);
    const slug = updateVendorDto.name?.replace(/\s+/g, '_');

    // Find the vendor
    const vendor = await this.databaseService.vendor.findUnique({
      where: { uuid },
    });

    if (!vendor) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Vendor not found',
        },
        404,
      );
    } else if (user.uuid !== vendor.user_uuid) {
      throw new HttpException(
        {
          status: 403,
          success: false,
          message: 'You are not authorized to update this vendor',
        },
        403,
      );
    }

    const updateData: any = {
      slug,
      ...updateVendorDto,
    };

    if (updateVendorDto.profileUrl) {
      updateData.profile = updateVendorDto.profileUrl;
    } else if (profile instanceof File) {
      updateData.profile = await this.storageService.bucket(
        token,
        'vendor_profile',
        profile,
      );
    } else {
      updateData.profile = vendor?.profile || null;
    }

    if (updateVendorDto.coverUrl) {
      updateData.cover = updateVendorDto.coverUrl;
    } else if (cover instanceof File) {
      updateData.cover = await this.storageService.bucket(
        token,
        'vendor_cover',
        cover,
      );
    } else {
      updateData.cover = vendor?.cover || null;
    }

    const updatedVendor = await this.databaseService.vendor.update({
      where: { uuid },
      data: updateData,
    });

    // Create or update related VendorDocuments
    if (
      updateVendorDto.id_number ||
      updateVendorDto.id_upload ||
      updateVendorDto.business_number ||
      updateVendorDto.business_upload ||
      updateVendorDto.country
    ) {
      const existingDocument =
        await this.databaseService.vendorDocuments.findUnique({
          where: { uuid: vendor.uuid },
        });

      const documentData: any = {
        uuid: vendor.uuid,
        country: updateVendorDto.country,
        id_number: updateVendorDto.id_number,
        business_number: updateVendorDto.business_number,
      };

      if (updateVendorDto.id_uploadUrl) {
        documentData.id_upload = updateVendorDto.id_uploadUrl;
      } else if (id_upload instanceof File) {
        documentData.id_upload = await this.storageService.bucket(
          token,
          'id_upload',
          id_upload,
        );
      } else {
        documentData.id_upload = existingDocument?.id_upload || null;
      }

      if (updateVendorDto.business_uploadUrl) {
        documentData.business_upload = updateVendorDto.business_uploadUrl;
      } else if (business_upload instanceof File) {
        documentData.business_upload = await this.storageService.bucket(
          token,
          'business_upload',
          business_upload,
        );
      } else {
        documentData.business_upload =
          existingDocument?.business_upload || null;
      }

      if (existingDocument) {
        await this.databaseService.vendorDocuments.update({
          where: { uuid: vendor.uuid },
          data: documentData,
        });
      } else {
        await this.databaseService.vendorDocuments.create({
          data: documentData,
        });
      }
    }

    return {
      status: 200,
      success: true,
      message: 'Vendor updated successfully',
      data: {
        vendor: updatedVendor,
      },
    };
  }

  /**
   * Soft delete a vendor by marking status as deleted
   * @param token
   * @param uuid
   * @returns Deletion status message
   */
  async remove(token: string, uuid: string) {
    const user = await this.MiddlewareService.decodeToken(token);
    const vendor = await this.databaseService.vendor.findUnique({
      where: { uuid },
    });

    if (!vendor) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Vendor not found',
        },
        404,
      );
    } else if (user.uuid !== vendor.user_uuid) {
      throw new HttpException(
        {
          status: 403,
          success: false,
          message: 'You are not authorized to delete this vendor',
        },
        403,
      );
    }

    await this.databaseService.vendor.update({
      where: { uuid },
      data: {
        status: 'deleted',
      },
    });

    return {
      status: 200,
      success: true,
      message:
        'Vendor deletion request sent; account data will be deleted in 30 days',
    };
  }
}
