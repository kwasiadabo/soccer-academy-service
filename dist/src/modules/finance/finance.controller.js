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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const finance_service_1 = require("./finance.service");
const fee_type_dto_1 = require("./dto/fee-type.dto");
const fee_item_dto_1 = require("./dto/fee-item.dto");
const invoice_dto_1 = require("./dto/invoice.dto");
const payment_dto_1 = require("./dto/payment.dto");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    findAllFeeItems(includeInactive) {
        return this.financeService.findAllFeeItems(includeInactive === 'true');
    }
    createFeeItem(dto) {
        return this.financeService.createFeeItem(dto);
    }
    updateFeeItem(id, dto) {
        return this.financeService.updateFeeItem(id, dto);
    }
    findAllFeeTypes(includeInactive) {
        return this.financeService.findAllFeeTypes(includeInactive === 'true');
    }
    createFeeType(dto) {
        return this.financeService.createFeeType(dto);
    }
    updateFeeType(id, dto) {
        return this.financeService.updateFeeType(id, dto);
    }
    addFeeTypeItem(id, dto) {
        return this.financeService.addFeeTypeItem(id, dto.feeItemId);
    }
    removeFeeTypeItem(id, feeItemId) {
        return this.financeService.removeFeeTypeItem(id, feeItemId);
    }
    getTeamStats() {
        return this.financeService.getTeamStats();
    }
    listDebtors() {
        return this.financeService.listDebtors();
    }
    getDebtorsAging(minMonths) {
        return this.financeService.getDebtorsAging(minMonths ? Number(minMonths) : 0);
    }
    getPaymentsReport(from, to, feeTypeId, playerId) {
        return this.financeService.getPaymentsReport(from, to, feeTypeId, playerId);
    }
    getMonthlyBilling(month) {
        return this.financeService.getMonthlyBilling(month);
    }
    findInvoicesForPlayer(playerId) {
        return this.financeService.findInvoicesForPlayer(playerId);
    }
    createInvoice(dto) {
        return this.financeService.createInvoice(dto);
    }
    createPayment(dto, user) {
        return this.financeService.createPayment(dto, user.userId);
    }
    runRecurringInvoices() {
        return this.financeService.generateRecurringInvoices();
    }
    sendReminder(id, playerId) {
        return this.financeService.sendPaymentReminder(playerId, id);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('fee-items'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllFeeItems", null);
__decorate([
    (0, common_1.Post)('fee-items'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'FEE_ITEM_CREATE', entityType: 'FeeItem' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_item_dto_1.CreateFeeItemDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createFeeItem", null);
__decorate([
    (0, common_1.Patch)('fee-items/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'FEE_ITEM_UPDATE', entityType: 'FeeItem' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_item_dto_1.UpdateFeeItemDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateFeeItem", null);
__decorate([
    (0, common_1.Get)('fee-types'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllFeeTypes", null);
__decorate([
    (0, common_1.Post)('fee-types'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'FEE_TYPE_CREATE', entityType: 'FeeType' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_type_dto_1.CreateFeeTypeDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createFeeType", null);
__decorate([
    (0, common_1.Patch)('fee-types/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'FEE_TYPE_UPDATE', entityType: 'FeeType' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_type_dto_1.UpdateFeeTypeDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateFeeType", null);
__decorate([
    (0, common_1.Post)('fee-types/:id/items'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'FEE_TYPE_ITEM_ADD', entityType: 'FeeType' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_type_dto_1.AddFeeTypeItemDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "addFeeTypeItem", null);
__decorate([
    (0, common_1.Delete)('fee-types/:id/items/:feeItemId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'FEE_TYPE_ITEM_REMOVE', entityType: 'FeeType' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('feeItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "removeFeeTypeItem", null);
__decorate([
    (0, common_1.Get)('stats/teams'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getTeamStats", null);
__decorate([
    (0, common_1.Get)('invoices/debtors'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listDebtors", null);
__decorate([
    (0, common_1.Get)('invoices/debtors/aging'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __param(0, (0, common_1.Query)('minMonths')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getDebtorsAging", null);
__decorate([
    (0, common_1.Get)('payments/report'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('feeTypeId')),
    __param(3, (0, common_1.Query)('playerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getPaymentsReport", null);
__decorate([
    (0, common_1.Get)('invoices/monthly-billing'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __param(0, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getMonthlyBilling", null);
__decorate([
    (0, common_1.Get)('invoices'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_VIEW),
    __param(0, (0, common_1.Query)('playerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findInvoicesForPlayer", null);
__decorate([
    (0, common_1.Post)('invoices'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'INVOICE_CREATE', entityType: 'Invoice' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PAYMENT_CREATE', entityType: 'Payment' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('recurring-invoices/run'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'RECURRING_INVOICES_RUN', entityType: 'Invoice' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "runRecurringInvoices", null);
__decorate([
    (0, common_1.Post)('invoices/:id/remind'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.FINANCE_MANAGE),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PAYMENT_REMINDER_SENT', entityType: 'Invoice' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('playerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "sendReminder", null);
exports.FinanceController = FinanceController = __decorate([
    (0, swagger_1.ApiTags)('finance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map