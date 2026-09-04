import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { ReceiptsService } from './receipts.service';

@Module({
  imports: [MessagingModule],
  providers: [ReceiptsService],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
