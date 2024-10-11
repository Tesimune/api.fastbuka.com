import { Controller, Get, Post, Body, Headers, Delete, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserProfileDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  // Login route
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }



  // Register route
  @Post('register')
  register(
    @Body(ValidationPipe) user: CreateUserDto,
    @Body(ValidationPipe) profile: CreateUserProfileDto
  ) {
    return this.authService.register(user, profile);
  }


  
  // Logout route
  @Delete('logout')
  logout(@Headers('token') token: string) {
    return this.authService.logout(token);
  }
}
