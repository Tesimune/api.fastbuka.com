import {
  Controller,
  Get,
  Body,
  Headers,
  Patch,
  Delete,
  Version,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/auth/dto/update-auth.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Version('1')
  @Get('profile')
  @ApiOperation({ summary: 'Fetch profile' })
  profile(@Headers('token') token: string) {
    return this.usersService.profile(token);
  }

  @Version('1')
  @Get('wallet')
  @ApiOperation({ summary: 'Fetch wallet' })
  wallet(@Headers('token') token: string) {
    return this.usersService.wallet(token);
  }

  @Version('1')
  @Patch('profile')
  @ApiOperation({ summary: 'Update Profile' })
  update(
    @Headers('token') token: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(token, updateUserDto);
  }

  @Version('1')
  @Patch('deactivate')
  @ApiOperation({ summary: 'Deactivate account' })
  deactivate(@Headers('token') token: string, @Body() password: string) {
    return this.usersService.deactivate(token, password);
  }

  @Version('1')
  @Patch('activate')
  @ApiOperation({ summary: 'Activate account' })
  activate(@Body(ValidationPipe) body: ResetPasswordDto) {
    return this.usersService.activate(body);
  }

  @Version('1')
  @Delete('account')
  @ApiOperation({ summary: 'Delete acount' })
  remove(@Headers('token') token: string, @Body() password: string) {
    return this.usersService.remove(token, password);
  }
}
