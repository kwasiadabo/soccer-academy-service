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
exports.MyShopController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const products_service_1 = require("./products.service");
const merchandise_orders_service_1 = require("./merchandise-orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
let MyShopController = class MyShopController {
    constructor(productsService, ordersService) {
        this.productsService = productsService;
        this.ordersService = ordersService;
    }
    listProducts() {
        return this.productsService.findAll(false);
    }
    getProduct(id) {
        return this.productsService.findOne(id, false);
    }
    async getProductImage(id, imageId, res) {
        const { buffer, mimeType } = await this.productsService.getImage(id, imageId);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.send(buffer);
    }
    listMyOrders(user) {
        return this.ordersService.listMine(user.userId);
    }
    getMyOrder(id, user) {
        return this.ordersService.getMine(user.userId, id);
    }
    createOrder(dto, user) {
        return this.ordersService.createOrder(user.userId, dto);
    }
};
exports.MyShopController = MyShopController;
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'List active shop products.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Products returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MyShopController.prototype, "listProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a product by ID.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Product returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyShopController.prototype, "getProduct", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Get)('products/:id/images/:imageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a product image (binary response).' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Image bytes returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MyShopController.prototype, "getProductImage", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: "List the current guardian's orders." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Orders returned.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyShopController.prototype, "listMyOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, swagger_1.ApiOperation)({ summary: "Get one of the current guardian's orders by ID." }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MyShopController.prototype, "getMyOrder", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Place a new order.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Order created.' }),
    (0, audit_log_decorator_1.AuditLog)({ action: 'MERCHANDISE_ORDER_CREATE', entityType: 'MerchandiseOrder' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], MyShopController.prototype, "createOrder", null);
exports.MyShopController = MyShopController = __decorate([
    (0, swagger_1.ApiTags)('parent-portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid access token.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Caller lacks the required permission.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.PARENT_PORTAL_ACCESS),
    (0, common_1.Controller)('parent-portal/shop'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        merchandise_orders_service_1.MerchandiseOrdersService])
], MyShopController);
//# sourceMappingURL=my-shop.controller.js.map