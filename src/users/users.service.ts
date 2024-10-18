import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly MiddlewareService: MiddlewareService,
  ) {}
  async profile(token: string) {
    const user = await this.MiddlewareService.decodeToken(token);

    return this.databaseService.user.findUnique({
      where: { uuid: user.uuid },
      include: {
        profile: true,
      },
    });
  }

  update(token: string, updateUserDto: UpdateUserDto) {
    return `This action updates a user`;
  }

  remove(token: string) {
    return `This action removes a user`;
  }
}
