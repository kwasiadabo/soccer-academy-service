"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const nestjs_pino_1 = require("nestjs-pino");
const env_validation_1 = require("./config/env.validation");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const academy_config_module_1 = require("./modules/academy-config/academy-config.module");
const audit_module_1 = require("./modules/audit/audit.module");
const audit_interceptor_1 = require("./modules/audit/audit.interceptor");
const storage_module_1 = require("./modules/storage/storage.module");
const players_module_1 = require("./modules/players/players.module");
const coaches_module_1 = require("./modules/coaches/coaches.module");
const guardians_module_1 = require("./modules/guardians/guardians.module");
const training_module_1 = require("./modules/training/training.module");
const assessments_module_1 = require("./modules/assessments/assessments.module");
const matches_module_1 = require("./modules/matches/matches.module");
const parent_portal_module_1 = require("./modules/parent-portal/parent-portal.module");
const finance_module_1 = require("./modules/finance/finance.module");
const inquiries_module_1 = require("./modules/inquiries/inquiries.module");
const issues_module_1 = require("./modules/issues/issues.module");
const merchandise_module_1 = require("./modules/merchandise/merchandise.module");
const player_of_the_week_module_1 = require("./modules/player-of-the-week/player-of-the-week.module");
const gallery_module_1 = require("./modules/gallery/gallery.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, validate: env_validation_1.validateEnv }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
                    autoLogging: true,
                },
            }),
            throttler_1.ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 100 }] }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            audit_module_1.AuditModule,
            storage_module_1.StorageModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            academy_config_module_1.AcademyConfigModule,
            players_module_1.PlayersModule,
            coaches_module_1.CoachesModule,
            guardians_module_1.GuardiansModule,
            training_module_1.TrainingModule,
            assessments_module_1.AssessmentsModule,
            matches_module_1.MatchesModule,
            parent_portal_module_1.ParentPortalModule,
            finance_module_1.FinanceModule,
            inquiries_module_1.InquiriesModule,
            issues_module_1.IssuesModule,
            merchandise_module_1.MerchandiseModule,
            player_of_the_week_module_1.PlayerOfTheWeekModule,
            gallery_module_1.GalleryModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_FILTER, useClass: all_exceptions_filter_1.AllExceptionsFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: audit_interceptor_1.AuditInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map