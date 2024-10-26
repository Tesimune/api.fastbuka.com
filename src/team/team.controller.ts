import { Body, Controller, Delete, Get, Param, Post, Version } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TeamService } from "./team.service";
import { CreateTeamDTO } from "./dto/create-team.dto";
// import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('team')
@Controller('team')
export class TeamController{
    constructor(private readonly teamService: TeamService){}

    @Version('1')
    @Post()
    create(
        @Body() createTeamDto: CreateTeamDTO,
    ){
        return this.teamService.create(createTeamDto)
    }

    @Version('1')
    @Get()
    findAll(){
        return this.teamService.findAll()
    }

    @Version('1')
    @Get()
    findOne(@Param('uuid') uuid: string){
        return this.teamService.findOne(uuid);
    }

    @Version('1')
    @Delete(':uuid')
    remove(@Param('uuid') uuid: string){
        return this.teamService.remove(uuid);
    }
}
