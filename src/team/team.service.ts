import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTeamDTO } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTeamDto: CreateTeamDTO) {
    try {
      const team = await this.databaseService.team.create({
        data: createTeamDto,
      });

      return {
        status: 200,
        success: true,
        message: 'Team member added successfully',
        data: {
          team,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: 'Internal server',
          error,
        },
        500,
      );
    }
  }

  async findAll() {
    try {
      const Team = await this.databaseService.team.findMany();
      return {
        status: 200,
        success: true,
        message: 'Team members successfully retrieved',
        data: {
          Team,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: 'Internal server',
          error,
        },
        500,
      );
    }
  }

  async findOne(uuid: string) {
    try {
      const Team = await this.databaseService.team.findUnique({
        where: { uuid },
      });
      return {
        status: 200,
        success: true,
        message: 'Member fetched successfully',
        data: {
          Team,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: 'Internal server',
          error,
        },
        500,
      );
    }
  }

  async remove(uuid: string) {
    try {
      await this.databaseService.team.delete({
        where: { uuid },
      });
      return {
        status: 200,
        success: true,
        message: 'Member deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: 'Internal server',
          error,
        },
        500,
      );
    }
  }
}
