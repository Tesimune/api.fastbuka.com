import {
  Controller,
  Get,
  Body,
  Headers,
  Patch,
  Delete,
  Version,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordDto, UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/auth/dto/update-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Get('decrypt')
  @ApiOperation({ summary: 'Decrypt secret key using authorization token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully decrypted secret key',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiResponse({
    status: 404,
    description: 'Secret key not found',
  })
  decrypt(@Headers('token') token: string) {
    return this.usersService.decrypt(token);
  }
  @Version('1')
  @Patch('profile')
  @ApiOperation({ summary: 'Update Profile' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profile'))
  update(
    @Headers('token') token: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile('profile') profile?: Express.Multer.File,
  ) {
    return this.usersService.update(token, updateUserDto, profile);
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
  remove(@Headers('token') token: string, @Body() body: PasswordDto) {
    return this.usersService.remove(token, body.password);
  }
}
