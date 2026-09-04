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
exports.ParentPortalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const parent_portal_service_1 = require("./parent-portal.service");
const coach_feedback_dto_1 = require("./dto/coach-feedback.dto");
let ParentPortalController = class ParentPortalController {
    constructor(parentPortalService) {
        this.parentPortalService = parentPortalService;
    }
    listChildren(user) {
        return this.parentPortalService.listChildren(user.userId);
    }
    getPlayerOfTheWeekAwards(user) {
        return this.parentPortalService.getPlayerOfTheWeekAwards(user.userId);
    }
    getChild(playerId, user) {
        return this.parentPortalService.getChild(user.userId, playerId);
    }
    async getPhoto(playerId, user, res) {
        const { buffer, mimeType } = await this.parentPortalService.getPhoto(user.userId, playerId);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.send(buffer);
    }
    getAttendance(playerId, user) {
        return this.parentPortalService.getAttendance(user.userId, playerId);
    }
    getAssessments(playerId, user) {
        return this.parentPortalService.getAssessments(user.userId, playerId);
    }
    getActivityMarks(playerId, user) {
        return this.parentPortalService.getActivityMarks(user.userId, playerId);
    }
    getCoaches(playerId, user) {
        return this.parentPortalService.getCoaches(user.userId, playerId);
    }
    getMatches(playerId, user) {
        return this.parentPortalService.getMatches(user.userId, playerId);
    }
    getFinanceSummary(playerId, user) {
        return this.parentPortalService.getFinanceSummary(user.userId, playerId);
    }
    getStatement(playerId, user) {
        return this.parentPortalService.getStatement(user.userId, playerId);
    }
    submitFeedback(playerId, dto, user) {
        return this.parentPortalService.submitFeedback(user.userId, playerId, dto);
    }
};
exports.ParentPortalController = ParentPortalController;
__decorate([
    (0, common_1.Get)('children'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "listChildren", null);
__decorate([
    (0, common_1.Get)('player-of-the-week'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getPlayerOfTheWeekAwards", null);
__decorate([
    (0, common_1.Get)('children/:playerId'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getChild", null);
__decorate([
    (0, common_1.Get)('children/:playerId/photo'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ParentPortalController.prototype, "getPhoto", null);
__decorate([
    (0, common_1.Get)('children/:playerId/attendance'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Get)('children/:playerId/assessments'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getAssessments", null);
__decorate([
    (0, common_1.Get)('children/:playerId/activity-marks'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getActivityMarks", null);
__decorate([
    (0, common_1.Get)('children/:playerId/coaches'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getCoaches", null);
__decorate([
    (0, common_1.Get)('children/:playerId/matches'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getMatches", null);
__decorate([
    (0, common_1.Get)('children/:playerId/finance-summary'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getFinanceSummary", null);
__decorate([
    (0, common_1.Get)('children/:playerId/statement'),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "getStatement", null);
__decorate([
    (0, common_1.Post)('children/:playerId/feedback'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'COACH_FEEDBACK_SUBMIT', entityType: 'CoachFeedback' }),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coach_feedback_dto_1.CreateCoachFeedbackDto, Object]),
    __metadata("design:returntype", void 0)
], ParentPortalController.prototype, "submitFeedback", null);
exports.ParentPortalController = ParentPortalController = __decorate([
    (0, swagger_1.ApiTags)('parent-portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PARENT_PORTAL_ACCESS),
    (0, common_1.Controller)('parent-portal'),
    __metadata("design:paramtypes", [parent_portal_service_1.ParentPortalService])
], ParentPortalController);
//# sourceMappingURL=parent-portal.controller.js.map