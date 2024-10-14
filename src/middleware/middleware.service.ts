import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';

@Injectable()
export class MiddlewareService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async decodeToken(token: string): Promise<User> {
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const userToken = await this.databaseService.personalAccessToken.findUnique(
      {
        where: { token },
      },
    );

    if (!userToken) {
      throw new UnauthorizedException({
        statusCode: 401,
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const user = await this.databaseService.user.findUnique({
      where: { uuid: userToken.user_uuid },
    });

    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        success: false,
        message: 'User not found',
      });
    }

    return user;
  }
}
