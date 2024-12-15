import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MiddlewareService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async decodeToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

  const bearer = token.split(' ')[1];

    const tokenBearer = await this.databaseService.personalAccessToken.findUnique(
      {
        where: { token: bearer },
      },
    );

    if (!tokenBearer) {
      throw new UnauthorizedException({
        statusCode: 401,
        success: false,
        message: 'Unauthenticated',
      });
    }

    const user = await this.databaseService.user.findUnique({
      where: { uuid: tokenBearer.user_uuid },
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
