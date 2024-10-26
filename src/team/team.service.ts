import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateTeamDTO } from "./dto/create-team.dto";

@Injectable()
export class TeamService {
    constructor(private readonly databaseService: DatabaseService) {}

    create(createTeamDto: CreateTeamDTO, profile: Express.Multer.File){
        const Team = {
            ...createTeamDto,
            profile: `/uploads/${profile.filename}`,
        };

        const team = this.databaseService.team.create({
            data: Team
        });

        return {
            status: 200,
            success: true,
            message: 'Team member added successfully',
            data:{
                team,
            }
        }
    }

    findAll(){
        const team = this.databaseService.team.findMany();
        return{
            status: 200,
            success: true,
            message: 'Team members successfully retrieved',
            data:{
                team,
            }
        };
    }

    findOne(uuid: string){
        const team = this.databaseService.team.findUnique({
            where: {uuid},
        });
        return{
            status: 200,
            success: true,
            message: 'Member fetched successfully',
            data: {
                team,
            }
        };
    }

    remove(uuid: string){
        this.databaseService.team.delete({
            where: {uuid},
        });
        return{
            status:200,
            success: true,
            message: 'Member deleted successfully'
        };
    }
}