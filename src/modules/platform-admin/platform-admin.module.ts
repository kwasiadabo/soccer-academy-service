import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BillingModule } from '../billing/billing.module';
import { StorageModule } from '../storage/storage.module';
import { PlatformAdminController } from './platform-admin.controller';
import { PlatformAdminService } from './platform-admin.service';
import { PlatformAdminJwtStrategy } from './strategies/platform-admin-jwt.strategy';

@Module({
  imports: [PassportModule, BillingModule, StorageModule],
  controllers: [PlatformAdminController],
  providers: [PlatformAdminService, PlatformAdminJwtStrategy],
})
export class PlatformAdminModule {}
