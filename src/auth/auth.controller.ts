import {
  Controller,
  Post,
  Body,
  Headers,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserProfileDto } from './dto/create-user.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  /**
   * Login route
   * @param body 
   * @returns 
   */
  @Post('login')
  @ApiOperation({ summary: 'Auth login' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }


  /**
   * Register route
   * @param user 
   * @param profile 
   * @returns 
   */
  @Post('register')
  @ApiOperation({ summary: 'Auth register' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  register(
    @Body(ValidationPipe) user: CreateUserDto,
  ) {
    return this.authService.register(user);
  }


  /**
   * Logout route
   * @param token 
   * @returns 
   */
  @Delete('logout')
  @ApiOperation({ summary: 'Auth logout' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  logout(@Headers('token') token: string) {
    return this.authService.logout(token);
  }
}
