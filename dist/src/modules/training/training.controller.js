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
exports.TrainingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const training_service_1 = require("./training.service");
const training_plan_dto_1 = require("./dto/training-plan.dto");
const training_activity_dto_1 = require("./dto/training-activity.dto");
const training_decision_dto_1 = require("./dto/training-decision.dto");
const training_session_dto_1 = require("./dto/training-session.dto");
const training_activity_mark_dto_1 = require("./dto/training-activity-mark.dto");
const training_session_activity_dto_1 = require("./dto/training-session-activity.dto");
const OWN_OR_APPROVE = [permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN, permissions_constants_1.PERMISSIONS.TRAINING_APPROVE];
const VIEW_SESSIONS = [
    permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN,
    permissions_constants_1.PERMISSIONS.TRAINING_APPROVE,
    permissions_constants_1.PERMISSIONS.TRAINING_ATTENDANCE_RECORD,
];
const RECORD_ATTENDANCE = [permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN, permissions_constants_1.PERMISSIONS.TRAINING_ATTENDANCE_RECORD];
let TrainingController = class TrainingController {
    constructor(trainingService) {
        this.trainingService = trainingService;
    }
    findAllPlans(user, status) {
        return this.trainingService.findAllPlans(user, status);
    }
    listTeams(user) {
        return this.trainingService.listTeamsForPicker(user);
    }
    findOnePlan(id, user) {
        return this.trainingService.findOnePlan(id, user);
    }
    createPlan(dto, user) {
        return this.trainingService.createPlan(user.userId, dto);
    }
    updatePlan(id, dto, user) {
        return this.trainingService.updatePlan(id, user.userId, dto);
    }
    addActivity(id, dto, user) {
        return this.trainingService.addActivity(id, user.userId, dto);
    }
    updateActivity(id, activityId, dto, user) {
        return this.trainingService.updateActivity(id, activityId, user.userId, dto);
    }
    removeActivity(id, activityId, user) {
        return this.trainingService.removeActivity(id, activityId, user.userId);
    }
    submit(id, user) {
        return this.trainingService.submit(id, user.userId);
    }
    decide(id, dto, user) {
        return this.trainingService.decide(id, user.userId, dto);
    }
    findAllSessions(user) {
        return this.trainingService.findAllSessions(user);
    }
    findOneSession(id) {
        return this.trainingService.findOneSession(id);
    }
    createSession(dto, user) {
        return this.trainingService.createSession(user.userId, dto);
    }
    getOrCreateSaturdaySession(dto) {
        return this.trainingService.getOrCreateSaturdaySession(dto.teamId, dto.date);
    }
    quickMarkAttendance(dto, user) {
        return this.trainingService.quickMarkAttendance(dto.playerId, user, dto.status);
    }
    updateSession(id, dto, user) {
        return this.trainingService.updateSession(id, user.userId, dto);
    }
    recordAttendance(id, dto, user) {
        return this.trainingService.recordAttendance(id, user, dto);
    }
    addSessionActivity(id, dto, user) {
        return this.trainingService.addSessionActivity(id, user, dto);
    }
    removeSessionActivity(id, activityId, user) {
        return this.trainingService.removeSessionActivity(id, activityId, user);
    }
    getActivityMarks(activityId, user) {
        return this.trainingService.getActivityMarks(activityId, user);
    }
    upsertActivityMarks(activityId, dto, user) {
        return this.trainingService.upsertActivityMarks(activityId, user, dto);
    }
    getPlayerMarks(playerId, user) {
        return this.trainingService.getPlayerMarks(playerId, user);
    }
    getTeamMarks(teamId, user) {
        return this.trainingService.getTeamMarks(teamId, user);
    }
};
exports.TrainingController = TrainingController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, permissions_decorator_1.RequireAnyPermission)(...OWN_OR_APPROVE),
    (0, swagger_1.ApiOperation)({ summary: 'List training plans, optionally filtered by approval status.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Plans returned.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "findAllPlans", null);
__decorate([
    (0, common_1.Get)('plans/teams'),
    (0, permissions_decorator_1.RequireAnyPermission)(...VIEW_SESSIONS),
    (0, swagger_1.ApiOperation)({ summary: 'List teams the current user can pick a training plan for.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Teams returned.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "listTeams", null);
__decorate([
    (0, common_1.Get)('plans/:id'),
    (0, permissions_decorator_1.RequireAnyPermission)(...OWN_OR_APPROVE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a training plan by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Plan returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "findOnePlan", null);
__decorate([
    (0, common_1.Post)('plans'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_PLAN_CREATE', entityType: 'TrainingPlan' }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a training plan.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Plan created.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [training_plan_dto_1.CreateTrainingPlanDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Patch)('plans/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_PLAN_UPDATE', entityType: 'TrainingPlan' }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a training plan.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Plan updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_plan_dto_1.UpdateTrainingPlanDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Post)('plans/:id/activities'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_ACTIVITY_CREATE', entityType: 'TrainingPlan' }),
    (0, swagger_1.ApiOperation)({ summary: 'Add an activity to a training plan.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Activity added.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_plan_dto_1.CreateTrainingActivityInputDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "addActivity", null);
__decorate([
    (0, common_1.Patch)('plans/:id/activities/:activityId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_ACTIVITY_UPDATE', entityType: 'TrainingPlan' }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a training plan activity.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Activity updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, training_activity_dto_1.UpdateTrainingActivityDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "updateActivity", null);
__decorate([
    (0, common_1.Delete)('plans/:id/activities/:activityId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_ACTIVITY_DELETE', entityType: 'TrainingPlan' }),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an activity from a training plan.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Activity removed.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "removeActivity", null);
__decorate([
    (0, common_1.Post)('plans/:id/submit'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_PLAN_SUBMIT', entityType: 'TrainingPlan' }),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a training plan for approval.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Plan submitted.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)('plans/:id/decision'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_APPROVE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_PLAN_DECISION', entityType: 'TrainingPlan' }),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject a submitted training plan.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Decision recorded.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_decision_dto_1.TrainingPlanDecisionDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "decide", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, permissions_decorator_1.RequireAnyPermission)(...VIEW_SESSIONS),
    (0, swagger_1.ApiOperation)({ summary: 'List training sessions.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Sessions returned.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "findAllSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    (0, permissions_decorator_1.RequireAnyPermission)(...VIEW_SESSIONS),
    (0, swagger_1.ApiOperation)({ summary: 'Get a training session by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Session returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "findOneSession", null);
__decorate([
    (0, common_1.Post)('sessions'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_SESSION_CREATE', entityType: 'TrainingSession' }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a training session.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Session created.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [training_session_dto_1.CreateTrainingSessionDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "createSession", null);
__decorate([
    (0, common_1.Post)('sessions/saturday'),
    (0, permissions_decorator_1.RequireAnyPermission)(...RECORD_ATTENDANCE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_SESSION_SATURDAY_RESOLVE', entityType: 'TrainingSession' }),
    (0, swagger_1.ApiOperation)({ summary: "Get or create a team's Saturday session for a given date." }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Session resolved.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [training_session_dto_1.GetOrCreateSaturdaySessionDto]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "getOrCreateSaturdaySession", null);
__decorate([
    (0, common_1.Post)('attendance/mark'),
    (0, permissions_decorator_1.RequireAnyPermission)(...RECORD_ATTENDANCE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_ATTENDANCE_RECORD', entityType: 'TrainingSession' }),
    (0, swagger_1.ApiOperation)({ summary: "Mark a player's attendance for their own Saturday session." }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Attendance recorded.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [training_session_dto_1.QuickMarkAttendanceDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "quickMarkAttendance", null);
__decorate([
    (0, common_1.Patch)('sessions/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_SESSION_UPDATE', entityType: 'TrainingSession' }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a training session.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Session updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_session_dto_1.UpdateTrainingSessionDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Post)('sessions/:id/attendance'),
    (0, permissions_decorator_1.RequireAnyPermission)(...RECORD_ATTENDANCE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_ATTENDANCE_RECORD', entityType: 'TrainingSession' }),
    (0, swagger_1.ApiOperation)({ summary: 'Record attendance for a training session.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Attendance recorded.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_session_dto_1.RecordAttendanceDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "recordAttendance", null);
__decorate([
    (0, common_1.Post)('sessions/:id/activities'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_SESSION_ACTIVITY_CREATE', entityType: 'TrainingSession' }),
    (0, swagger_1.ApiOperation)({ summary: 'Add an activity to a training session.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Activity added.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_session_activity_dto_1.CreateSessionActivityDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "addSessionActivity", null);
__decorate([
    (0, common_1.Delete)('sessions/:id/activities/:activityId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_SESSION_ACTIVITY_DELETE', entityType: 'TrainingSession' }),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an activity from a training session.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Activity removed.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "removeSessionActivity", null);
__decorate([
    (0, common_1.Get)('activities/:activityId/marks'),
    (0, permissions_decorator_1.RequireAnyPermission)(...OWN_OR_APPROVE),
    (0, swagger_1.ApiOperation)({ summary: 'Get recorded marks for a training activity.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Marks returned.' }),
    __param(0, (0, common_1.Param)('activityId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "getActivityMarks", null);
__decorate([
    (0, common_1.Post)('activities/:activityId/marks'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.TRAINING_MANAGE_OWN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_ACTIVITY_MARKS_RECORD', entityType: 'TrainingActivityMark' }),
    (0, swagger_1.ApiOperation)({ summary: 'Record marks for a training activity.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Marks recorded.' }),
    __param(0, (0, common_1.Param)('activityId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_activity_mark_dto_1.UpsertActivityMarksDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "upsertActivityMarks", null);
__decorate([
    (0, common_1.Get)('players/:playerId/marks'),
    (0, permissions_decorator_1.RequireAnyPermission)(...OWN_OR_APPROVE),
    (0, swagger_1.ApiOperation)({ summary: "Get a player's training activity marks." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Marks returned.' }),
    __param(0, (0, common_1.Param)('playerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "getPlayerMarks", null);
__decorate([
    (0, common_1.Get)('teams/:teamId/marks'),
    (0, permissions_decorator_1.RequireAnyPermission)(...OWN_OR_APPROVE),
    (0, swagger_1.ApiOperation)({ summary: "Get a team's training activity marks." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Marks returned.' }),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "getTeamMarks", null);
exports.TrainingController = TrainingController = __decorate([
    (0, swagger_1.ApiTags)('training'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid access token.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Caller lacks the required permission.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('training'),
    __metadata("design:paramtypes", [training_service_1.TrainingService])
], TrainingController);
//# sourceMappingURL=training.controller.js.map