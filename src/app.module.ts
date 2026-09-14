import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { validateEnv } from './config/env.validation';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TenantContextModule } from './common/tenant-context/tenant-context.module';
import { TenantResolutionMiddleware } from './common/middleware/tenant-resolution.middleware';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AcademiesModule } from './modules/academies/academies.module';
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
import { PlatformAdminModule } from './modules/platform-admin/platform-admin.module';
import { BillingModule } from './modules/billing/billing.module';

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
    TenantContextModule,
    AcademiesModule,
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
    PlatformAdminModule,
    BillingModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // NestModule middleware exclude/forRoutes patterns match the *pre-global-
    // prefix* path (e.g. 'platform/(.*)', not 'api/platform/(.*)') — Nest
    // applies the 'api' prefix set in main.ts separately, after this matching.
    // The bare root has no tenant of its own. `/platform/*` is the platform-
    // operator control plane (see PlatformAdminModule): it operates across
    // every academy, so it deliberately has no "current academy" to resolve.
    // (Swagger's docs UI mounts directly on the underlying HTTP adapter,
    // outside this middleware chain entirely, so it needs no exclusion at all.)
    consumer
      .apply(TenantResolutionMiddleware)
      .exclude('/', 'platform', 'platform/(.*)')
      .forRoutes('*');
  }
}
