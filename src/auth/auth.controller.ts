import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  Delete,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  ForgotPasswordDto,
  ResendEmailCodeDto,
  ResetPasswordDto,
  UpdateAuthDto,
  UpdatePasswordDto,
  VerifyEmailDto,
  DecryptDto,
} from './dto/update-auth.dto';

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
  register(@Body(ValidationPipe) user: CreateAuthDto) {
    return this.authService.register(user);
  }

  /**
   *
   * @param body
   * @returns
   */
  @Version('1')
  @Post('verify_email')
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  verifyEmail(@Body(ValidationPipe) body: VerifyEmailDto) {
    return this.authService.verifyEmail(body);
  }

  /**
   *
   * @param body
   * @returns
   */
  @Version('1')
  @Post('resend_email_code')
  @ApiOperation({ summary: 'Resend email code' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  resendEmailCode(@Body(ValidationPipe) body: ResendEmailCodeDto) {
    return this.authService.resendEmailCode(body.email);
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

  @Version('1')
  @Post('update_password')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updatePassword(
    @Headers('token') token: string,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(body, token);
  }

  @Version('1')
  @Post('forgot_password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Version('1')
  @Post('reset_password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  /**
   * Decrypt route
   * @param token
   * @returns
   */

  @Version('1')
  @Get('decrypt')
  @ApiOperation({ summary: 'Decrypt secret key using authorization token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully decrypted secret key' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Secret key not found' 
  })
  decrypt(@Headers('token') token: string) {
    return this.authService.decrypt(token);
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
