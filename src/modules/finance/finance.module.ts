import { Module } from '@nestjs/common';
import { PlayersModule } from '../players/players.module';
import { ReceiptsModule } from '../receipts/receipts.module';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

@Module({
  imports: [PlayersModule, ReceiptsModule],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
