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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardiansController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const guardians_service_1 = require("./guardians.service");
const grant_portal_access_dto_1 = require("./dto/grant-portal-access.dto");
let GuardiansController = class GuardiansController {
    constructor(guardiansService) {
        this.guardiansService = guardiansService;
    }
    findAll(search) {
        return this.guardiansService.findAll(search);
    }
    findOne(id) {
        return this.guardiansService.findOne(id);
    }
    grantPortalAccess(id, dto) {
        return this.guardiansService.grantPortalAccess(id, dto);
    }
};
exports.GuardiansController = GuardiansController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'List guardians, optionally filtered by search text.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Guardians returned.' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuardiansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a guardian by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Guardian returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuardiansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/portal-access'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create or link a login for this guardian and send a password-reset link' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Portal access granted.' }),
    (0, audit_log_decorator_1.AuditLog)({ action: 'GUARDIAN_PORTAL_ACCESS_GRANT', entityType: 'Guardian' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, grant_portal_access_dto_1.GrantGuardianPortalAccessDto]),
    __metadata("design:returntype", void 0)
], GuardiansController.prototype, "grantPortalAccess", null);
exports.GuardiansController = GuardiansController = __decorate([
    (0, swagger_1.ApiTags)('guardians'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid access token.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Caller lacks the required permission.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('guardians'),
    __metadata("design:paramtypes", [guardians_service_1.GuardiansService])
], GuardiansController);
//# sourceMappingURL=guardians.controller.js.map