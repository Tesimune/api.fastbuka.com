import { Body, Controller, Delete, Get, Param, Post, Version } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PartnerService } from "./partner.service";
import { CreatePartnerDTO } from "./dto/create-partner-dto";

@ApiTags('partner')
@Controller('partner')
export class PartnerController{
    constructor(private readonly partnerService: PartnerService){}

    @Version('1')
    @Post()
    create(
        @Body() createPartnerDto: CreatePartnerDTO,
    ){
        return this.partnerService.create(createPartnerDto);
    }

    @Version('1')
    @Get()
    findAll(){
        return this.partnerService.findAll()
    }

    @Version('1')
    @Get(':uuid')
    findOne(@Param('uuid') uuid: string){
        return this.partnerService.findOne(uuid);
    }

    @Version('1')
    @Delete(':uuid')
    remove(@Param('uuid') uuid: string){
        return this.partnerService.remove(uuid);
    }
}