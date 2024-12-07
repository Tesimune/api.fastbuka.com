import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDTO } from './dto/create-contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Version('1')
  @Post()
  create(@Body() createContactDto: CreateContactDTO) {
    return this.contactService.create(createContactDto);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.contactService.findAll();
  }
}
