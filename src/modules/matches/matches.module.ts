import { Module } from '@nestjs/common';
import { CoachesModule } from '../coaches/coaches.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [CoachesModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
