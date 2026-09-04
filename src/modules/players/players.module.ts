import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { PaystackModule } from '../paystack/paystack.module';
import { ReceiptsModule } from '../receipts/receipts.module';
import { CoachesModule } from '../coaches/coaches.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayerIdService } from './player-id.service';

@Module({
  imports: [StorageModule, PaystackModule, ReceiptsModule, CoachesModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayerIdService],
  exports: [PlayersService],
})
export class PlayersModule {}
