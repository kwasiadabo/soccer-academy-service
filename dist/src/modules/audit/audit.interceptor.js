"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
const audit_log_decorator_1 = require("./audit-log.decorator");
let AuditInterceptor = class AuditInterceptor {
    constructor(reflector, auditService) {
        this.reflector = reflector;
        this.auditService = auditService;
    }
    intercept(context, next) {
        const meta = this.reflector.get(audit_log_decorator_1.AUDIT_LOG_KEY, context.getHandler());
        if (!meta) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe((0, operators_1.tap)((result) => {
            const entityId = result?.id ?? request.params?.id ?? null;
            void this.auditService.record({
                actorUserId: request.user?.userId ?? null,
                action: meta.action,
                entityType: meta.entityType,
                entityId,
                afterData: result,
                ipAddress: request.ip ?? null,
            });
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map