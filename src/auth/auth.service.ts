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

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly MiddlewareService: MiddlewareService,
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
    // Extract the username from the email
    const username = user.email.split('@')[0];

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // generate random password
    const { publicKey, secret } = this.generateRandomWallet();

    // Hash the secret key
    const hashedSecret = await bcrypt.hash(secret, 10);

    // Create a new user and profile in a transaction
    try {
      return await this.databaseService.$transaction(async (prisma) => {
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

        // Create the UserProfile after the User is created
        // const createdProfile = await prisma.userProfile.create({
        await prisma.userProfile.create({
          data: {
            user_uuid: createdUser.uuid,
            first_name: user.name.split(' ')[0] || user.name,
            last_name: user.name.split(' ')[1] || user.name,
          },
        });

        const token = this.generateRandomToken(45);
        await this.databaseService.personalAccessToken.create({
          data: {
            user_uuid: createdUser.uuid,
            token,
          },
        });

        return {
          startus: 200,
          success: true,
          message: 'Registration successful',
          data: {
            emailIsVerified: createdUser.email_verified ? true : false,
            token,
            user,
          },
        };
      });
    } catch (error) {
      throw new HttpException(
        {
          status: 419,
          success: true,
          message: 'User registration failed. Please try again.',
        },
        419,
      );
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
    }

    const token = this.generateRandomToken(45);
    await this.databaseService.personalAccessToken.create({
      data: {
        user_uuid: user.uuid,
        token,
      },
    });

    return {
      startus: 200,
      success: true,
      message: 'Login successful',
      data: {
        emailIsVerified: user.email_verified ? true : false,
        token,
        user,
      },
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
