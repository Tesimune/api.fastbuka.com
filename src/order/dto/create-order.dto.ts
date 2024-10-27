import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateOrderDto {
    
    @IsString()
    @ApiProperty({})
    delivery_name: string;
    
    @IsEmail()
    @ApiProperty({})
    delivery_email: string;
    
    @IsString()
    @ApiProperty({})
    delivery_contact: string;
    
    @IsString()
    @ApiProperty({})
    delivery_address: string;
}
