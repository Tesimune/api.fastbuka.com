import {
  Controller,
  Post,
  Body,
  Headers,
  Delete,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  /**
   * Register route
   * @param user 
   * @param profile 
   * @returns 
   */
  @Version('1')
  @Post('register')
  @ApiOperation({ summary: 'Auth register' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  register(
    @Body(ValidationPipe) user: CreateAuthDto,
  ) {
    return this.authService.register(user);
  }


  
  /**
   * Login route
   * @param body 
   * @returns 
   */
  @Version('1')
  @Post('login')
  @ApiOperation({ summary: 'Auth login' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  login(@Body() body: UpdateAuthDto) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }


  /**
   * Logout route
   * @param token 
   * @returns 
   */
  @Version('1')
  @Delete('logout')
  @ApiOperation({ summary: 'Auth logout' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  logout(@Headers('token') token: string) {
    return this.authService.logout(token);
  }
}
