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
exports.AcademyConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const academy_config_service_1 = require("./academy-config.service");
const season_dto_1 = require("./dto/season.dto");
const age_category_dto_1 = require("./dto/age-category.dto");
const team_dto_1 = require("./dto/team.dto");
const training_group_dto_1 = require("./dto/training-group.dto");
let AcademyConfigController = class AcademyConfigController {
    constructor(service) {
        this.service = service;
    }
    listSeasons() {
        return this.service.listSeasons();
    }
    createSeason(dto) {
        return this.service.createSeason(dto);
    }
    updateSeason(id, dto) {
        return this.service.updateSeason(id, dto);
    }
    listAgeCategories() {
        return this.service.listAgeCategories();
    }
    createAgeCategory(dto) {
        return this.service.createAgeCategory(dto);
    }
    updateAgeCategory(id, dto) {
        return this.service.updateAgeCategory(id, dto);
    }
    listTeams() {
        return this.service.listTeams();
    }
    createTeam(dto) {
        return this.service.createTeam(dto);
    }
    updateTeam(id, dto) {
        return this.service.updateTeam(id, dto);
    }
    listTrainingGroups() {
        return this.service.listTrainingGroups();
    }
    createTrainingGroup(dto) {
        return this.service.createTrainingGroup(dto);
    }
    updateTrainingGroup(id, dto) {
        return this.service.updateTrainingGroup(id, dto);
    }
};
exports.AcademyConfigController = AcademyConfigController;
__decorate([
    (0, common_1.Get)('seasons'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_VIEW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "listSeasons", null);
__decorate([
    (0, common_1.Post)('seasons'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'SEASON_CREATE', entityType: 'Season' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [season_dto_1.CreateSeasonDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "createSeason", null);
__decorate([
    (0, common_1.Patch)('seasons/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'SEASON_UPDATE', entityType: 'Season' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, season_dto_1.UpdateSeasonDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "updateSeason", null);
__decorate([
    (0, common_1.Get)('age-categories'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_VIEW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "listAgeCategories", null);
__decorate([
    (0, common_1.Post)('age-categories'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'AGE_CATEGORY_CREATE', entityType: 'AgeCategory' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [age_category_dto_1.CreateAgeCategoryDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "createAgeCategory", null);
__decorate([
    (0, common_1.Patch)('age-categories/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'AGE_CATEGORY_UPDATE', entityType: 'AgeCategory' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, age_category_dto_1.UpdateAgeCategoryDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "updateAgeCategory", null);
__decorate([
    (0, common_1.Get)('teams'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_VIEW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "listTeams", null);
__decorate([
    (0, common_1.Post)('teams'),
    (0, permissions_decorator_1.RequireAnyPermission)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE, permissions_constants_1.PERMISSIONS.TEAMS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TEAM_CREATE', entityType: 'Team' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_dto_1.CreateTeamDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Patch)('teams/:id'),
    (0, permissions_decorator_1.RequireAnyPermission)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE, permissions_constants_1.PERMISSIONS.TEAMS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TEAM_UPDATE', entityType: 'Team' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, team_dto_1.UpdateTeamDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "updateTeam", null);
__decorate([
    (0, common_1.Get)('training-groups'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_VIEW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "listTrainingGroups", null);
__decorate([
    (0, common_1.Post)('training-groups'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_GROUP_CREATE', entityType: 'TrainingGroup' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [training_group_dto_1.CreateTrainingGroupDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "createTrainingGroup", null);
__decorate([
    (0, common_1.Patch)('training-groups/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ACADEMY_CONFIG_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'TRAINING_GROUP_UPDATE', entityType: 'TrainingGroup' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, training_group_dto_1.UpdateTrainingGroupDto]),
    __metadata("design:returntype", void 0)
], AcademyConfigController.prototype, "updateTrainingGroup", null);
exports.AcademyConfigController = AcademyConfigController = __decorate([
    (0, swagger_1.ApiTags)('academy-config'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('academy-config'),
    __metadata("design:paramtypes", [academy_config_service_1.AcademyConfigService])
], AcademyConfigController);
//# sourceMappingURL=academy-config.controller.js.map