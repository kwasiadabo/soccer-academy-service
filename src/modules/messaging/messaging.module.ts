import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

@Module({
  imports: [BillingModule],
  providers: [EmailService, SmsService],
  exports: [EmailService, SmsService],
})
export class MessagingModule {}
