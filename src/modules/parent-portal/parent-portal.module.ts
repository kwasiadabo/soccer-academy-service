import { Module } from '@nestjs/common';
import { GuardiansModule } from '../guardians/guardians.module';
import { StorageModule } from '../storage/storage.module';
import { ParentPortalController } from './parent-portal.controller';
import { ParentPortalService } from './parent-portal.service';

@Module({
  imports: [GuardiansModule, StorageModule],
  controllers: [ParentPortalController],
  providers: [ParentPortalService],
})
export class ParentPortalModule {}
