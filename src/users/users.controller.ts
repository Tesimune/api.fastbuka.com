import {
  Controller,
  Get,
  Body,
  Headers,
  Patch,
  Delete,
  Version,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

  
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Version('1')
  @Get('profile')
  profile(@Headers('token') token: string) {
    return this.usersService.profile(token);
  }

  @Version('1')
  @Patch('profile')
  update(@Headers('token') token: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(token, updateUserDto);
  }

  @Version('1')
  @Delete('account')
  remove(@Headers('token') token: string) {
    return this.usersService.remove(token);
  }
}
