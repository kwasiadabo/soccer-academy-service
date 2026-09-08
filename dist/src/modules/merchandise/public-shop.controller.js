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
exports.PublicShopController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const products_service_1 = require("./products.service");
const merchandise_orders_service_1 = require("./merchandise-orders.service");
const create_guest_order_dto_1 = require("./dto/create-guest-order.dto");
let PublicShopController = class PublicShopController {
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
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.send(buffer);
    }
    lookupPlayer(code) {
        return this.ordersService.lookupPlayerByCode(code);
    }
    createOrder(dto) {
        return this.ordersService.createGuestOrder(dto);
    }
};
exports.PublicShopController = PublicShopController;
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicShopController.prototype, "listProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicShopController.prototype, "getProduct", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Get)('products/:id/images/:imageId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PublicShopController.prototype, "getProductImage", null);
__decorate([
    (0, common_1.Get)('players/lookup'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicShopController.prototype, "lookupPlayer", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'MERCHANDISE_ORDER_CREATE', entityType: 'MerchandiseOrder' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guest_order_dto_1.CreateGuestOrderDto]),
    __metadata("design:returntype", void 0)
], PublicShopController.prototype, "createOrder", null);
exports.PublicShopController = PublicShopController = __decorate([
    (0, swagger_1.ApiTags)('shop'),
    (0, common_1.Controller)('shop'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        merchandise_orders_service_1.MerchandiseOrdersService])
], PublicShopController);
//# sourceMappingURL=public-shop.controller.js.map