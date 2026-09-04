import { Module } from '@nestjs/common';
import { AcademyConfigController } from './academy-config.controller';
import { AcademyConfigService } from './academy-config.service';

@Module({
  controllers: [AcademyConfigController],
  providers: [AcademyConfigService],
})
export class AcademyConfigModule {}
