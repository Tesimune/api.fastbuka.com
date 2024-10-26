import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsString } from "class-validator";

@ApiTags('contact')
export class CreateContactDTO {
    @IsString()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    phone: string;

    @IsString()
    @ApiProperty()
    address: string;
}