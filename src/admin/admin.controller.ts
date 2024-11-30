import { Controller, Get, Headers, Query, Version } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Version('1')
  @Get('dashboard')
  dashboard(@Headers('token') token: string) {
    return this.adminService.dashboard(token);
  }
}
