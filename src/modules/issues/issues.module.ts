import { Module } from '@nestjs/common';
import { GuardiansModule } from '../guardians/guardians.module';
import { IssuesController } from './issues.controller';
import { MyIssuesController } from './my-issues.controller';
import { IssuesService } from './issues.service';

@Module({
  imports: [GuardiansModule],
  controllers: [IssuesController, MyIssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
