import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ResendModule } from 'nestjs-resend';

@Module({
  imports: [
    ResendModule.forRootAsync({
      useFactory: async () => ({
        apiKey: process.env.RESEND_TOKEN,
      }),
    }),
  ],
  providers: [MailerService],
})
export class MailerModule {}
