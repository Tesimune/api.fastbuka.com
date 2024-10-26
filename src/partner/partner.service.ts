import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreatePartnerDTO } from "./dto/create-partner-dto";

@Injectable()
export class PartnerService{
    constructor (private readonly databaseService: DatabaseService){}

    create(createPartnerDto: CreatePartnerDTO){
        const Partner = this.databaseService.partner.create({
            data: createPartnerDto,
        });
        return{
            status: 200,
            success: true,
            message: 'Partner added successfully',
            data: {
                Partner,
            }
        }
    }

    findAll(){
        const Partner = this.databaseService.partner.findMany();
        return{
            status: 200,
            success: true,
            message: 'Partners retrieved successfully',
            data:{
                Partner,
            }
        }
    }

    findOne(uuid: string){
        const Partner = this.databaseService.partner.findUnique({
            where: {uuid},
        });
        return{
            status: 200,
            success: true,
            message: 'Partner retrieved successfully',
            data:{
                Partner,
            }
        }
    }
    remove(uuid: string){
        this.databaseService.partner.delete({
            where: {uuid},
        });
        return{
            status: 200,
            success: true,
            message: 'Partner deleted successfully'
        }
    }
}