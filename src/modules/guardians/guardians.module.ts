import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GuardiansController } from './guardians.controller';
import { GuardiansService } from './guardians.service';
import { GuardianContextService } from './guardian-context.service';

@Module({
  imports: [AuthModule],
  controllers: [GuardiansController],
  providers: [GuardiansService, GuardianContextService],
  exports: [GuardianContextService],
})
export class GuardiansModule {}
