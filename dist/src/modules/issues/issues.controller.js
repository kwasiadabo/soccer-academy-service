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
exports.IssuesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const issues_service_1 = require("./issues.service");
const create_issue_message_dto_1 = require("./dto/create-issue-message.dto");
const update_issue_status_dto_1 = require("./dto/update-issue-status.dto");
let IssuesController = class IssuesController {
    constructor(issuesService) {
        this.issuesService = issuesService;
    }
    listAll() {
        return this.issuesService.listAll();
    }
    getOne(id) {
        return this.issuesService.getForStaff(id);
    }
    addMessage(id, dto, user) {
        return this.issuesService.addStaffMessage(user.userId, id, dto.message);
    }
    updateStatus(id, dto) {
        return this.issuesService.updateStatus(id, dto.status);
    }
};
exports.IssuesController = IssuesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "listAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'ISSUE_STAFF_REPLY', entityType: 'ParentIssue' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_issue_message_dto_1.CreateIssueMessageDto, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'ISSUE_STATUS_UPDATE', entityType: 'ParentIssue' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_issue_status_dto_1.UpdateIssueStatusDto]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "updateStatus", null);
exports.IssuesController = IssuesController = __decorate([
    (0, swagger_1.ApiTags)('issues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ISSUES_MANAGE),
    (0, common_1.Controller)('issues'),
    __metadata("design:paramtypes", [issues_service_1.IssuesService])
], IssuesController);
//# sourceMappingURL=issues.controller.js.map