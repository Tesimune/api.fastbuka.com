import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";

@Module({
    imports: [DatabaseModule],
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule {}