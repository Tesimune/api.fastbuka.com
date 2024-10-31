import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsString } from "class-validator";

@ApiTags('partner')
export class CreatePartnerDTO{
    @IsString()
    @ApiProperty()
    logo:   string;

    @IsString()
    @ApiProperty()
    name:   string;
}