import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { validateEnv } from './config/env.validation';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AcademyConfigModule } from './modules/academy-config/academy-config.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuditInterceptor } from './modules/audit/audit.interceptor';
import { StorageModule } from './modules/storage/storage.module';
import { PlayersModule } from './modules/players/players.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { GuardiansModule } from './modules/guardians/guardians.module';
import { TrainingModule } from './modules/training/training.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { MatchesModule } from './modules/matches/matches.module';
import { ParentPortalModule } from './modules/parent-portal/parent-portal.module';
import { FinanceModule } from './modules/finance/finance.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { IssuesModule } from './modules/issues/issues.module';
import { MerchandiseModule } from './modules/merchandise/merchandise.module';
import { PlayerOfTheWeekModule } from './modules/player-of-the-week/player-of-the-week.module';
import { GalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        autoLogging: true,
      },
    }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 100 }] }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuditModule,
    StorageModule,
    AuthModule,
    UsersModule,
    AcademyConfigModule,
    PlayersModule,
    CoachesModule,
    GuardiansModule,
    TrainingModule,
    AssessmentsModule,
    MatchesModule,
    ParentPortalModule,
    FinanceModule,
    InquiriesModule,
    IssuesModule,
    MerchandiseModule,
    PlayerOfTheWeekModule,
    GalleryModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
