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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const matches_service_1 = require("./matches.service");
const opponent_dto_1 = require("./dto/opponent.dto");
const match_dto_1 = require("./dto/match.dto");
const match_participation_dto_1 = require("./dto/match-participation.dto");
const match_player_assessment_dto_1 = require("./dto/match-player-assessment.dto");
let MatchesController = class MatchesController {
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    listOpponents() {
        return this.matchesService.listOpponents();
    }
    createOpponent(dto) {
        return this.matchesService.createOpponent(dto);
    }
    findAll(user) {
        return this.matchesService.findAll(user);
    }
    findOne(id, user) {
        return this.matchesService.findOne(id, user);
    }
    create(dto, user) {
        return this.matchesService.create(user, dto);
    }
    update(id, dto, user) {
        return this.matchesService.update(id, user, dto);
    }
    setParticipations(id, dto, user) {
        return this.matchesService.setParticipations(id, user, dto);
    }
    addPlayerAssessment(id, dto, user) {
        return this.matchesService.addPlayerAssessment(id, user, dto);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Get)('opponents'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "listOpponents", null);
__decorate([
    (0, common_1.Post)('opponents'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'OPPONENT_CREATE', entityType: 'Opponent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [opponent_dto_1.CreateOpponentDto]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "createOpponent", null);
__decorate([
    (0, common_1.Get)('matches'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('matches/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('matches'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'MATCH_CREATE', entityType: 'Match' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_dto_1.CreateMatchDto, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('matches/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'MATCH_UPDATE', entityType: 'Match' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_dto_1.UpdateMatchDto, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('matches/:id/participations'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'MATCH_PARTICIPATIONS_SET', entityType: 'Match' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_participation_dto_1.SetParticipationsDto, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "setParticipations", null);
__decorate([
    (0, common_1.Post)('matches/:id/assessments'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MATCHES_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'MATCH_PLAYER_ASSESSMENT_CREATE', entityType: 'Match' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_player_assessment_dto_1.CreateMatchPlayerAssessmentDto, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "addPlayerAssessment", null);
exports.MatchesController = MatchesController = __decorate([
    (0, swagger_1.ApiTags)('matches'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map