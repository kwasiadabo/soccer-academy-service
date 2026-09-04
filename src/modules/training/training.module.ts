import { Module } from '@nestjs/common';
import { CoachesModule } from '../coaches/coaches.module';
import { MessagingModule } from '../messaging/messaging.module';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';

@Module({
  imports: [CoachesModule, MessagingModule],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule {}
