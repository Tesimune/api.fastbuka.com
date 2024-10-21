import { Injectable } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';

interface MailerDto {
  email: string;
  subject: string;
  message: string;
}

@Injectable()
export class MailerService {
  constructor(private readonly resendService: ResendService) {}

  public async mailer(mailer: MailerDto): Promise<MailerDto> {
    await this.resendService.send({
      from: process.env.MAILER || 'noreply@fastbuka.com',
      to: mailer.email || 'noreply@fastbuka.com',
      subject: mailer.subject || 'fastbuka',
      html: mailer.message || '<strong>null</strong>',
    });
    return mailer;
  }
}
