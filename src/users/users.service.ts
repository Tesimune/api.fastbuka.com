import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from 'src/auth/dto/update-auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly MiddlewareService: MiddlewareService,
  ) {}

  /**
   *
   * @param token
   * @returns
   */
  async profile(token: string) {
    const auth = await this.MiddlewareService.decodeToken(token);

    const user = await this.databaseService.user.findUnique({
      where: { uuid: auth.uuid },
      include: {
        profile: true,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Profile',
      data: {
        user,
      },
    };
  }

  /**
   *
   * @param token
   * @param updateUserDto
   * @returns
   */
  async update(token: string, updateUserDto: UpdateUserDto) {
    const auth = await this.MiddlewareService.decodeToken(token);
    if (updateUserDto.email !== auth.email) {
      const account = await this.databaseService.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (account) {
        throw new HttpException(
          {
            status: 401,
            success: false,
            message: 'Email address is already in use',
          },
          401,
        );
      }
      await this.databaseService.user.update({
        where: {
          uuid: auth.uuid,
        },
        data: {
          email: updateUserDto.email,
          email_verified: false,
        },
      });
    }
    await this.databaseService.userProfile.update({
      where: {
        user_uuid: auth.uuid,
      },
      data: {
        ...updateUserDto,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Profile updated',
    };
  }

  /**
   *
   * @param token
   * @returns
   */
  async deactivate(token: string, password: string) {
    const auth = await this.MiddlewareService.decodeToken(token);
    if (!(await bcrypt.compare(password, auth.password))) {
      throw new HttpException(
        {
          status: 401,
          success: false,
          message: 'Invalid password',
        },
        401,
      );
    }
    await this.databaseService.user.update({
      where: {
        uuid: auth.uuid,
      },
      data: {
        status: 'deactived',
      },
    });

    await this.databaseService.personalAccessToken.delete({
      where: { token },
    });

    return {
      status: 200,
      success: true,
      message: 'Acount deactived',
    };
  }

  /**
   *
   * @param body
   * @returns
   */
  async activate(body: ResetPasswordDto) {
    const user = await this.databaseService.passwordResetTokens.findFirst({
      where: {
        user_uuid: body.uuid,
        email: body.email,
        token: body.code,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Invalid token',
        },
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(body.new_password, 10);
    await this.databaseService.user.update({
      where: {
        uuid: user.user_uuid,
      },
      data: {
        status: 'actived',
        password: hashedPassword,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Acount deactived',
    };
  }

  /**
   *
   * @param token
   * @returns
   */
  async remove(token: string, password: string) {
    const auth = await this.MiddlewareService.decodeToken(token);
    if (!(await bcrypt.compare(password, auth.password))) {
      throw new HttpException(
        {
          status: 401,
          success: false,
          message: 'Invalid password',
        },
        401,
      );
    }
    await this.databaseService.user.update({
      where: {
        uuid: auth.uuid,
      },
      data: {
        status: 'delete',
      },
    });

    await this.databaseService.personalAccessToken.delete({
      where: { token },
    });

    return {
      status: 200,
      success: true,
      message: 'Delete request sent, account will be deleted 30 days',
    };
  }
}
