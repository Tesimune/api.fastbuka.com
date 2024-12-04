import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsString } from "class-validator";

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

    @IsArray()
    @ApiProperty({
        type: Array,
        items: {
            type: 'object',
            properties: {
                food_uuid: { type: 'string' },
                quantity: { type: 'number' },
            },
        },
    })
    cartItems: Array<{ food_uuid: string; quantity: number }>;
}
