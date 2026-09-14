import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { AcademiesService } from './academies.service';
import { AcademiesController } from './academies.controller';

@Module({
  imports: [StorageModule],
  controllers: [AcademiesController],
  providers: [AcademiesService],
  exports: [AcademiesService],
})
export class AcademiesModule {}
