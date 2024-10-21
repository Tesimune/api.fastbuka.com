import {
  HttpException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Keypair } from '@stellar/stellar-sdk';
import { MailerService } from 'src/mailer/mailer.service';
import { Exceptions } from '@stellar/typescript-wallet-sdk';
import {
  ResetPasswordDto,
  UpdatePasswordDto,
  VerifyEmailDto,
} from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly MiddlewareService: MiddlewareService,
    private readonly mailerService: MailerService,
  ) {}

  private generateRandomToken(length: number): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  private generateRandomWallet(): { publicKey: string; secret: string } {
    const keypair = Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secret: keypair.secret(),
    };
  }

  /**
   * Registration Service
   * @param user
   * @param profile
   * @returns
   */
  async register(user: CreateAuthDto) {
    const account = await this.databaseService.user.findUnique({
      where: { email: user.email },
    });

    if (account) {
      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: 'Email address is already in use',
      });
    }

    const baseUsername = user.email.split('@')[0];
    let username = baseUsername;

    let usernameExists = await this.databaseService.user.findUnique({
      where: { username: username },
    });

    let counter = 1;
    while (usernameExists) {
      username = `${baseUsername}${counter}`;
      usernameExists = await this.databaseService.user.findUnique({
        where: { username: username },
      });
      counter++;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const { publicKey, secret } = this.generateRandomWallet();
    const hashedSecret = await bcrypt.hash(secret, 10);

    const newUser = await this.databaseService.$transaction(async (prisma) => {
      const createdUser = await prisma.user.create({
        data: {
          email: user.email,
          username: username,
          password: hashedPassword,
          contact: user.contact,
          walletAddress: publicKey,
          secretKey: hashedSecret,
        },
      });

      const createProfile = await prisma.userProfile.create({
        data: {
          user_uuid: createdUser.uuid,
          first_name: user.name.split(' ')[0] || user.name,
          last_name: user.name.split(' ')[1] || user.name,
        },
      });

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      await prisma.emailVerificationTokens.create({
        data: {
          user_uuid: createdUser.uuid,
          email: createdUser.email,
          token: code,
        },
      });

      const mailer = {
        email: user.email,
        subject: 'Email verification',
        message: `<p>Hey ${createProfile.first_name} welcome to fastbuka, <br><br> Your vefication code is: ${code} <br><br>This code will expire in 10 minutes.<p>`,
      };
      await this.mailerService.mailer(mailer);

      return createdUser;
    });
    return {
      status: 200,
      success: true,
      message: 'Registration Successful, please Proceed to Login.',
      data: {
        user: newUser,
      },
    };
  }

  /**
   *
   * @param uuid
   * @param email
   * @param code
   * @returns
   */
  async verifyEmail(body: VerifyEmailDto) {
    const token = await this.databaseService.emailVerificationTokens.findFirst({
      where: {
        user_uuid: body.uuid,
        email: body.email,
        token: body.code,
      },
    });

    if (!token) {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Invalid verification code.',
        },
        419,
      );
    }

    const timeout = 10 * 60 * 1000;
    if (new Date().getTime() - new Date(token.createdAt).getTime() > timeout) {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Verification token has expired.',
        },
        419,
      );
    }

    await this.databaseService.user.update({
      where: { uuid: body.uuid },
      data: { email_verified: true },
    });

    await this.databaseService.emailVerificationTokens.delete({
      where: { id: token.id },
    });

    return {
      status: 200,
      success: true,
      message: 'Email successfully verified.',
    };
  }

  /**
   *
   * @param email
   * @returns
   */
  async resendEmailCode(email: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          email: email,
        },
        include: {
          profile: true,
        },
      });

      if (!user) {
        return {
          status: 404,
          success: false,
          message: `User with email ${email} does not exist.`,
        };
      }

      const code = Math.floor(1000 + Math.random() * 9000).toString();

      await this.databaseService.emailVerificationTokens.create({
        data: {
          user_uuid: user.uuid,
          email: user.email,
          token: code,
        },
      });

      const mailer = {
        email: user.email,
        subject: 'Email Verification',
        message: `<p>Hey ${user.profile.first_name}, <br><br> Your vefication code is: ${code} <br><br>This code will expire in 10 minutes.<p>`,
      };
      await this.mailerService.mailer(mailer);

      return {
        status: 200,
        success: true,
        message: `Verification code sent successfully to ${email}.`,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: 'An error occurred while sending the verification code.',
        error: error.message,
      };
    }
  }

  /**
   * Login Service
   * @param email
   * @param password
   * @returns
   */
  async login(email: string, password: string) {
    if (!email) {
      throw new UnprocessableEntityException('Email is required.');
    }

    if (!password) {
      throw new UnprocessableEntityException('Password is required.');
    }

    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    } else if (user.status !== 'actived') {
      const code = Math.floor(1000 + Math.random() * 9000).toString();

      await this.databaseService.passwordResetTokens.create({
        data: {
          user_uuid: user.uuid,
          email: user.email,
          token: code,
        },
      });

      const mailer = {
        email: user.email,
        subject: 'Activation Verification',
        message: `<p>Hey ${user.profile.first_name}, <br><br> Please use vefication code is: ${code} to activate your account.<br><br>This code will expire in 10 minutes.<p>`,
      };
      await this.mailerService.mailer(mailer);

      throw new HttpException(
        {
          status: 419,
          success: false,
          message: `Your account is currently ${user.status}. An email has been sent to you for reactivation.`,
          data: {
            user,
          },
        },
        419,
      );
    }

    const token = this.generateRandomToken(45);
    await this.databaseService.personalAccessToken.create({
      data: {
        user_uuid: user.uuid,
        token,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Login successful',
      data: {
        token,
        user,
      },
    };
  }

  /**
   *
   * @param body
   * @param token
   * @returns
   */
  async updatePassword(body: UpdatePasswordDto, token: string) {
    const user = await this.MiddlewareService.decodeToken(token);
    if (!user || !(await bcrypt.compare(body.old_password, user.password))) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(body.new_password, 10);

    await this.databaseService.user.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Password updated',
    };
  }

  /**
   *
   * @param email
   */
  async forgotPassword(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'User not found',
        },
        404,
      );
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await this.databaseService.passwordResetTokens.create({
      data: {
        user_uuid: user.uuid,
        email: user.email,
        token: code,
      },
    });

    const mailer = {
      email: user.email,
      subject: 'Forgot password verification',
      message: `<p>Hey ${user.profile.first_name}, <br><br> Your reset password vefication code is: ${code} <br><br>This code will expire in 10 minutes.<p>`,
    };
    await this.mailerService.mailer(mailer);

    return {
      status: 200,
      success: true,
      message: 'Verification code sent',
      data: {
        uuid: user.uuid,
        email: user.email,
      },
    };
  }

  /**
   *
   * @param body
   * @returns
   */
  async resetPassword(body: ResetPasswordDto) {
    const token = await this.databaseService.passwordResetTokens.findFirst({
      where: {
        user_uuid: body.uuid,
        email: body.email,
        token: body.code,
      },
    });

    if (!token) {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: `Invalid verification code ${body.code}.`,
        },
        419,
      );
    }

    const timeout = 10 * 60 * 1000;
    if (new Date().getTime() - new Date(token.createdAt).getTime() > timeout) {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Verification token has expired.',
        },
        419,
      );
    }

    const hashedPassword = await bcrypt.hash(body.new_password, 10);

    await this.databaseService.user.update({
      where: {
        uuid: body.uuid,
      },
      data: {
        password: hashedPassword,
      },
    });

    await this.databaseService.passwordResetTokens.delete({
      where: { id: token.id },
    });

    return {
      status: 200,
      success: true,
      message: 'Password successfully.',
    };
  }

  /**
   * Logout Service
   * @param token
   * @returns
   */
  async logout(token: string) {
    const user = await this.MiddlewareService.decodeToken(token);
    if (!user) {
      throw new UnauthorizedException({
        status: 412,
        success: false,
        message: 'User not found',
      });
    }
    await this.databaseService.personalAccessToken.delete({
      where: { token },
    });
    return 'User logged out successfully';
  }
}

declare module './dto/create-auth.dto' {
  interface UserCreateInput {
    walletAddress: string;
  }
}
