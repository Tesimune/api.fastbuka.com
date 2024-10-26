import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateContactDTO } from "./dto/create-contact.dto";

@Injectable()
export class ContactService {
    constructor(private readonly databaseService: DatabaseService){}

    create(createContactDto: CreateContactDTO){
        const Contact = this.databaseService.contact.create({
            data: createContactDto,
        });
        return {
            status: 200,
            success: true,
            message: 'Contact created successfully',
            data:{
                Contact,
            }
        }
    }

    findAll(){
        const Contact = this.databaseService.contact.findMany();
        return{
            status: 200,
            success: true,
            message: 'contact retrieved successfully',
            data:{
                Contact,
            }
        }
    }

    

}