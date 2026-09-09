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
exports.CoachesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const coaches_service_1 = require("./coaches.service");
const coach_dto_1 = require("./dto/coach.dto");
const grant_portal_access_dto_1 = require("./dto/grant-portal-access.dto");
const coach_qualification_dto_1 = require("./dto/coach-qualification.dto");
const coach_assignment_dto_1 = require("./dto/coach-assignment.dto");
let CoachesController = class CoachesController {
    constructor(coachesService) {
        this.coachesService = coachesService;
    }
    findAll(search) {
        return this.coachesService.findAll(search);
    }
    findOne(id) {
        return this.coachesService.findOne(id);
    }
    create(dto) {
        return this.coachesService.create(dto);
    }
    update(id, dto) {
        return this.coachesService.update(id, dto);
    }
    grantPortalAccess(id, dto) {
        return this.coachesService.grantPortalAccess(id, dto);
    }
    addQualification(id, dto) {
        return this.coachesService.addQualification(id, dto);
    }
    addAssignment(id, dto) {
        return this.coachesService.addAssignment(id, dto);
    }
    endAssignment(id, assignmentId, dto) {
        return this.coachesService.endAssignment(id, assignmentId, dto);
    }
};
exports.CoachesController = CoachesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'List coaches, optionally filtered by search text.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Coaches returned.' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a coach by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Coach returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_CREATE', entityType: 'Coach' }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a coach.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Coach created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coach_dto_1.CreateCoachDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_UPDATE', entityType: 'Coach' }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a coach.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Coach updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coach_dto_1.UpdateCoachDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/portal-access'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create or link a login for this coach and send a password-reset link' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Portal access granted.' }),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_PORTAL_ACCESS_GRANT', entityType: 'Coach' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, grant_portal_access_dto_1.GrantCoachPortalAccessDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "grantPortalAccess", null);
__decorate([
    (0, common_1.Post)(':id/qualifications'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_QUALIFICATION_CREATE', entityType: 'Coach' }),
    (0, swagger_1.ApiOperation)({ summary: 'Add a qualification to a coach.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Qualification added.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coach_qualification_dto_1.CreateCoachQualificationDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "addQualification", null);
__decorate([
    (0, common_1.Post)(':id/assignments'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_ASSIGNMENT_CREATE', entityType: 'Coach' }),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a coach to a team.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Assignment created.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coach_assignment_dto_1.CreateCoachAssignmentDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "addAssignment", null);
__decorate([
    (0, common_1.Patch)(':id/assignments/:assignmentId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.COACHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_ASSIGNMENT_END', entityType: 'Coach' }),
    (0, swagger_1.ApiOperation)({ summary: 'End a coach assignment.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Assignment ended.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('assignmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, coach_assignment_dto_1.EndCoachAssignmentDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "endAssignment", null);
exports.CoachesController = CoachesController = __decorate([
    (0, swagger_1.ApiTags)('coaches'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid access token.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Caller lacks the required permission.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('coaches'),
    __metadata("design:paramtypes", [coaches_service_1.CoachesService])
], CoachesController);
//# sourceMappingURL=coaches.controller.js.map