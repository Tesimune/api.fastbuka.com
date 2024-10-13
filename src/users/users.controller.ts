import {
  Controller,
  Get,
  // Post,
  Body,
  Headers,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get profile route
  @Get('profile')
  profile(@Headers('token') token: string) {
    return this.usersService.profile(token);
  }

  @Patch('profile')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // return this.usersService.update(updateUserDto);
  }

  @Delete('account')
  remove(@Param('id') id: string) {
    return this.usersService.remove();
  }
}
