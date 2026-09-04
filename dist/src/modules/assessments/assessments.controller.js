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
exports.AssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const assessments_service_1 = require("./assessments.service");
const assessment_template_dto_1 = require("./dto/assessment-template.dto");
const player_assessment_dto_1 = require("./dto/player-assessment.dto");
const coach_remark_dto_1 = require("./dto/coach-remark.dto");
const ANY_ASSESSMENT_ACCESS = [
    permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES,
    permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_OWN,
    permissions_constants_1.PERMISSIONS.ASSESSMENTS_VIEW,
];
let AssessmentsController = class AssessmentsController {
    constructor(assessmentsService) {
        this.assessmentsService = assessmentsService;
    }
    findAllTemplates() {
        return this.assessmentsService.findAllTemplates();
    }
    findAllOversight(teamId, trainingSessionId) {
        return this.assessmentsService.findAllOversight(teamId, trainingSessionId);
    }
    createTemplate(dto) {
        return this.assessmentsService.createTemplate(dto);
    }
    updateTemplate(id, dto) {
        return this.assessmentsService.updateTemplate(id, dto);
    }
    addCriteria(id, dto) {
        return this.assessmentsService.addCriteria(id, dto);
    }
    findForPlayer(playerId, user) {
        return this.assessmentsService.findForPlayer(playerId, user);
    }
    createAssessment(playerId, dto, user) {
        return this.assessmentsService.createAssessment(playerId, user.userId, dto);
    }
    updateAssessment(playerId, assessmentId, dto, user) {
        return this.assessmentsService.updateAssessment(playerId, assessmentId, user.userId, dto);
    }
    findRemarks(playerId, user) {
        return this.assessmentsService.findRemarksForPlayer(playerId, user);
    }
    createRemark(playerId, dto, user) {
        return this.assessmentsService.createRemark(playerId, user.userId, dto);
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Get)('templates'),
    (0, permissions_decorator_1.RequireAnyPermission)(...ANY_ASSESSMENT_ACCESS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findAllTemplates", null);
__decorate([
    (0, common_1.Get)('oversight'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_VIEW),
    __param(0, (0, common_1.Query)('teamId')),
    __param(1, (0, common_1.Query)('trainingSessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findAllOversight", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES),
    (0, audit_log_decorator_1.AuditLog)({ action: 'ASSESSMENT_TEMPLATE_CREATE', entityType: 'AssessmentTemplate' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assessment_template_dto_1.CreateAssessmentTemplateDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Patch)('templates/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES),
    (0, audit_log_decorator_1.AuditLog)({ action: 'ASSESSMENT_TEMPLATE_UPDATE', entityType: 'AssessmentTemplate' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assessment_template_dto_1.UpdateAssessmentTemplateDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:id/criteria'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES),
    (0, audit_log_decorator_1.AuditLog)({ action: 'ASSESSMENT_CRITERIA_CREATE', entityType: 'AssessmentTemplate' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assessment_template_dto_1.CreateAssessmentCriteriaInputDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "addCriteria", null);
__decorate([
    (0, common_1.Get)('players/:playerId'),
    (0, permissions_decorator_1.RequireAnyPermission)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_VIEW, permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_OWN),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findForPlayer", null);
__decorate([
    (0, common_1.Post)('players/:playerId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_ASSESSMENT_CREATE', entityType: 'PlayerAssessment' }),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, player_assessment_dto_1.CreatePlayerAssessmentDto, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "createAssessment", null);
__decorate([
    (0, common_1.Patch)('players/:playerId/:assessmentId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_ASSESSMENT_UPDATE', entityType: 'PlayerAssessment' }),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, common_1.Param)('assessmentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, player_assessment_dto_1.UpdatePlayerAssessmentDto, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "updateAssessment", null);
__decorate([
    (0, common_1.Get)('players/:playerId/remarks'),
    (0, permissions_decorator_1.RequireAnyPermission)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_VIEW, permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_OWN),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findRemarks", null);
__decorate([
    (0, common_1.Post)('players/:playerId/remarks'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSESSMENTS_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_REMARK_CREATE', entityType: 'CoachRemark' }),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coach_remark_dto_1.CreateCoachRemarkDto, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "createRemark", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, swagger_1.ApiTags)('assessments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('assessments'),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService])
], AssessmentsController);
//# sourceMappingURL=assessments.controller.js.map