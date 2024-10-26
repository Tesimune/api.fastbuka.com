import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateTeamDTO } from "./dto/create-team.dto";

@Injectable()
export class TeamService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createTeamDto: CreateTeamDTO) {
        const team = await this.databaseService.team.create({
            data: createTeamDto,
        });

        return {
            status: 200,
            success: true,
            message: 'Team member added successfully',
            data: {
                team,
            }
        };
    }

    async findAll() {
        const team = await this.databaseService.team.findMany();
        return {
            status: 200,
            success: true,
            message: 'Team members successfully retrieved',
            data: {
                team,
            }
        };
    }

    async findOne(uuid: string) {
        const team = await this.databaseService.team.findUnique({
            where: { uuid },
        });
        return {
            status: 200,
            success: true,
            message: 'Member fetched successfully',
            data: {
                team,
            }
        };
    }

    async remove(uuid: string) {
        await this.databaseService.team.delete({
            where: { uuid },
        });
        return {
            status: 200,
            success: true,
            message: 'Member deleted successfully'
        };
    }
}
