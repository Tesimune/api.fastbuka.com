import {
  Controller,
  Get,
  Headers,
  Patch,
  Param,
  Query,
  Version,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

@ApiBearerAuth()
  @Version('1')
  @Get('dashboard')
  dashboard(@Headers('Authorization') token: string, @Query('year') year: number) {
    return this.adminService.dashboard(token, +year);
  }

  @Version('1')
  @ApiBearerAuth()
  @Get('users')
  users(
    @Headers('Authorization') token: string,
    @Query('user_uuid') user_uuid?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.users(token, user_uuid, page, limit);
  }

@ApiBearerAuth()
  @Version('1')
  @Patch('role/:user_uuid')
  role(@Headers('Authorization') token: string, @Param('user_uuid') user_uuid: string) {
    return this.adminService.role(token, user_uuid);
  }

  @Version('1')
  @ApiBearerAuth()
  @Patch('user/status/:user_uuid')
  userStatus(
    @Headers('Authorization') token: string,
    @Param('user_uuid') user_uuid: string,
    @Body('status') status: string,
  ) {
    return this.adminService.userStatus(token, user_uuid, status);
  }

  @Version('1')
  @ApiBearerAuth()
  @Get('vendors')
  vendors(
    @Headers('Authorization') token: string,
    @Query('vendor_uuid') vendor_uuid?: string,
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.vendors(token, vendor_uuid, status, page, limit);
  }

  @Version('1')
  @ApiBearerAuth()
  @Patch('approve/:vendor_uuid')
  approveVendor(
    @Headers('Authorization') token: string,
    @Param('vendor_uuid') vendor_uuid: string,
  ) {
    return this.adminService.approveVendor(token, vendor_uuid);
  }

  @Version('1')
  @ApiBearerAuth()
  @Get('riders')
  riders(
    @Headers('Authorization') token: string,
    @Query('rider_uuid') rider_uuid?: string,
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.riders(token, rider_uuid, status, page, limit);
  }

  @Version('1')
  @ApiBearerAuth()
  @Patch('approve/:rider_uuid')
  approveRider(
    @Headers('Authorization') token: string,
    @Param('rider_uuid') rider_uuid: string,
  ) {
    return this.adminService.approveRider(token, rider_uuid);
  }

  @Version('1')
  @ApiBearerAuth()
  @Get('transactions')
  transactions(
    @Headers('Authorization') token: string,
    @Query('transaction_id') transaction_id?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.transactions(token, transaction_id, page, limit);
  }
}
