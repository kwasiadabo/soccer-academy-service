import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { PlayerOfTheWeekController } from './player-of-the-week.controller';
import { PlayerOfTheWeekService } from './player-of-the-week.service';

@Module({
  imports: [StorageModule],
  controllers: [PlayerOfTheWeekController],
  providers: [PlayerOfTheWeekService],
})
export class PlayerOfTheWeekModule {}
