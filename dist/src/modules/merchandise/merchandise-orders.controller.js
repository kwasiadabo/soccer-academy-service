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
exports.MerchandiseOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const merchandise_orders_service_1 = require("./merchandise-orders.service");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
let MerchandiseOrdersController = class MerchandiseOrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    listAll(status) {
        return this.ordersService.listAll(status);
    }
    pendingCount() {
        return this.ordersService.pendingCount();
    }
    getOne(id) {
        return this.ordersService.getForStaff(id);
    }
    updateStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto.status, dto.staffNotes);
    }
};
exports.MerchandiseOrdersController = MerchandiseOrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List merchandise orders, optionally filtered by status.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Orders returned.' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MerchandiseOrdersController.prototype, "listAll", null);
__decorate([
    (0, common_1.Get)('pending-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the count of orders pending action.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Count returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MerchandiseOrdersController.prototype, "pendingCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an order by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MerchandiseOrdersController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update the status of an order.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order updated.' }),
    (0, audit_log_decorator_1.AuditLog)({ action: 'MERCHANDISE_ORDER_STATUS_UPDATE', entityType: 'MerchandiseOrder' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], MerchandiseOrdersController.prototype, "updateStatus", null);
exports.MerchandiseOrdersController = MerchandiseOrdersController = __decorate([
    (0, swagger_1.ApiTags)('merchandise'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid access token.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Caller lacks the required permission.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ORDERS_MANAGE),
    (0, common_1.Controller)('merchandise/orders'),
    __metadata("design:paramtypes", [merchandise_orders_service_1.MerchandiseOrdersService])
], MerchandiseOrdersController);
//# sourceMappingURL=merchandise-orders.controller.js.map