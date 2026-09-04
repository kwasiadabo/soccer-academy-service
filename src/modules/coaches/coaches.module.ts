import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CoachesController } from './coaches.controller';
import { CoachesService } from './coaches.service';
import { CoachContextService } from './coach-context.service';

@Module({
  imports: [AuthModule],
  controllers: [CoachesController],
  providers: [CoachesService, CoachContextService],
  exports: [CoachContextService],
})
export class CoachesModule {}
