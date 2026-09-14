import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { PlatformEmailService } from './platform-email.service';
import { PlatformPaystackService } from './platform-paystack.service';

@Module({
  controllers: [BillingController],
  providers: [BillingService, PlatformPaystackService, PlatformEmailService],
  exports: [BillingService],
})
export class BillingModule {}
