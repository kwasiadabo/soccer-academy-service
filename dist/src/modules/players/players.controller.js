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
exports.PlayersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const players_service_1 = require("./players.service");
const create_player_dto_1 = require("./dto/create-player.dto");
const update_player_dto_1 = require("./dto/update-player.dto");
const player_team_assignment_dto_1 = require("./dto/player-team-assignment.dto");
const player_status_dto_1 = require("./dto/player-status.dto");
const add_guardian_dto_1 = require("./dto/add-guardian.dto");
const confirm_payment_dto_1 = require("./dto/confirm-payment.dto");
const paystack_charge_dto_1 = require("./dto/paystack-charge.dto");
let PlayersController = class PlayersController {
    constructor(playersService) {
        this.playersService = playersService;
    }
    findAll(user, status, search, teamId) {
        return this.playersService.findAll({ status, search, teamId }, user);
    }
    listBirthdays(withinDays) {
        return this.playersService.listBirthdays(withinDays ? Number(withinDays) : 30);
    }
    findOne(id) {
        return this.playersService.findOne(id);
    }
    async getPhoto(id, res) {
        const { buffer, mimeType } = await this.playersService.getPhoto(id);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.send(buffer);
    }
    create(dto) {
        return this.playersService.create(dto);
    }
    update(id, dto) {
        return this.playersService.update(id, dto);
    }
    updateTeamAssignment(id, dto) {
        return this.playersService.updateTeamAssignment(id, dto);
    }
    updateStatus(id, dto) {
        return this.playersService.updateStatus(id, dto.status);
    }
    addGuardian(id, dto) {
        return this.playersService.addGuardian(id, dto);
    }
    submit(id) {
        return this.playersService.submit(id);
    }
    approve(id, user) {
        return this.playersService.approve(id, user.userId);
    }
    confirmPayment(id, dto, user) {
        return this.playersService.confirmPayment(id, user.userId, dto);
    }
    initiatePaystackCharge(id, dto) {
        return this.playersService.initiatePaystackRegistrationCharge(id, dto);
    }
    verifyPaystackCharge(id, dto, user) {
        return this.playersService.verifyPaystackRegistrationCharge(id, dto.reference, user.userId);
    }
    uploadPhoto(id, file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return this.playersService.uploadPhoto(id, file, user.userId);
    }
};
exports.PlayersController = PlayersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List players, optionally filtered by status, search text, or team.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Players returned.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('birthdays'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'List players with birthdays within a window of days.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Players returned.' }),
    __param(0, (0, common_1.Query)('withinDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "listBirthdays", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get a player by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Player returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/photo'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: "Get a player's photo (binary response)." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Image bytes returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "getPhoto", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_REGISTRATION_CREATE', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Start a player registration.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Player created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_player_dto_1.CreatePlayerDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_UPDATE', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a player.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Player updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_player_dto_1.UpdatePlayerDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/team'),
    (0, permissions_decorator_1.RequireAnyPermission)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE, permissions_constants_1.PERMISSIONS.PLAYERS_TEAM_ASSIGN),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_TEAM_ASSIGN', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: "Update a player's team assignment." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Assignment updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, player_team_assignment_dto_1.UpdatePlayerTeamAssignmentDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "updateTeamAssignment", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, permissions_decorator_1.RequireAnyPermission)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE, permissions_constants_1.PERMISSIONS.PLAYERS_STATUS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_STATUS_UPDATE', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: "Update a player's status." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Status updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, player_status_dto_1.UpdatePlayerStatusDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/guardians'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_GUARDIAN_ADD', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Add a guardian to a player.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Guardian added.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_guardian_dto_1.AddGuardianDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "addGuardian", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_REGISTRATION_SUBMIT', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a player registration for approval.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Registration submitted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_REGISTRATION_APPROVE', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a player registration.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Registration approved.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/confirm-payment'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_REGISTRATION_PAYMENT_CONFIRM', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a player registration payment was received manually.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Payment confirmed.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirm_payment_dto_1.ConfirmRegistrationPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)(':id/registration-payment/paystack/charge'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_REGISTRATION_PAYSTACK_CHARGE', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate a Paystack charge for a registration payment.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Charge initiated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paystack_charge_dto_1.InitiatePaystackChargeDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "initiatePaystackCharge", null);
__decorate([
    (0, common_1.Post)(':id/registration-payment/paystack/verify'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_REGISTRATION_PAYSTACK_VERIFY', entityType: 'Player' }),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a Paystack charge and confirm the registration payment.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Charge verified.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paystack_charge_dto_1.VerifyPaystackChargeDto, Object]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "verifyPaystackCharge", null);
__decorate([
    (0, common_1.Post)(':id/photo'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PLAYERS_MANAGE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: "Upload a player's photo." }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Photo uploaded.' }),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PLAYER_PHOTO_UPLOAD', entityType: 'Player' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "uploadPhoto", null);
exports.PlayersController = PlayersController = __decorate([
    (0, swagger_1.ApiTags)('players'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid access token.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Caller lacks the required permission.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('players'),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], PlayersController);
//# sourceMappingURL=players.controller.js.map