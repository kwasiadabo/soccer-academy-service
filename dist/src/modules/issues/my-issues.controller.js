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
exports.MyIssuesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const issues_service_1 = require("./issues.service");
const create_issue_dto_1 = require("./dto/create-issue.dto");
const create_issue_message_dto_1 = require("./dto/create-issue-message.dto");
let MyIssuesController = class MyIssuesController {
    constructor(issuesService) {
        this.issuesService = issuesService;
    }
    listMine(user) {
        return this.issuesService.listMyIssues(user.userId);
    }
    unreadCount(user) {
        return this.issuesService.unreadCount(user.userId);
    }
    create(dto, user) {
        return this.issuesService.createIssue(user.userId, dto);
    }
    getOne(id, user) {
        return this.issuesService.getMyIssue(user.userId, id);
    }
    addMessage(id, dto, user) {
        return this.issuesService.addMyMessage(user.userId, id, dto.message);
    }
};
exports.MyIssuesController = MyIssuesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List the current guardian's issues." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Issues returned.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyIssuesController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the count of unread staff replies across the current guardian\'s issues.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Count returned.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyIssuesController.prototype, "unreadCount", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Raise a new issue.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Issue created.' }),
    (0, audit_log_decorator_1.AuditLog)({ action: 'ISSUE_CREATE', entityType: 'ParentIssue' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_issue_dto_1.CreateIssueDto, Object]),
    __metadata("design:returntype", void 0)
], MyIssuesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one of the current guardian\'s issues by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Issue returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MyIssuesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a message to one of the current guardian\'s issues.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Message added.' }),
    (0, audit_log_decorator_1.AuditLog)({ action: 'ISSUE_MESSAGE_ADD', entityType: 'ParentIssue' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_issue_message_dto_1.CreateIssueMessageDto, Object]),
    __metadata("design:returntype", void 0)
], MyIssuesController.prototype, "addMessage", null);
exports.MyIssuesController = MyIssuesController = __decorate([
    (0, swagger_1.ApiTags)('parent-portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid access token.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Caller lacks the required permission.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PARENT_PORTAL_ACCESS),
    (0, common_1.Controller)('parent-portal/issues'),
    __metadata("design:paramtypes", [issues_service_1.IssuesService])
], MyIssuesController);
//# sourceMappingURL=my-issues.controller.js.map