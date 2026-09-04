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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const create_variant_dto_1 = require("./dto/create-variant.dto");
const update_variant_dto_1 = require("./dto/update-variant.dto");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll() {
        return this.productsService.findAll();
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    async getImage(id, imageId, res) {
        const { buffer, mimeType } = await this.productsService.getImage(id, imageId);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.send(buffer);
    }
    create(dto) {
        return this.productsService.create(dto);
    }
    update(id, dto) {
        return this.productsService.update(id, dto);
    }
    addVariant(id, dto) {
        return this.productsService.addVariant(id, dto);
    }
    updateVariant(id, variantId, dto) {
        return this.productsService.updateVariant(id, variantId, dto);
    }
    addImage(id, file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return this.productsService.addImage(id, file, user.userId);
    }
    removeImage(id, imageId) {
        return this.productsService.removeImage(id, imageId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Get)(':id/images/:imageId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getImage", null);
__decorate([
    (0, common_1.Post)(),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PRODUCT_CREATE', entityType: 'Product' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PRODUCT_UPDATE', entityType: 'Product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/variants'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PRODUCT_VARIANT_CREATE', entityType: 'Product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_variant_dto_1.CreateVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "addVariant", null);
__decorate([
    (0, common_1.Patch)(':id/variants/:variantId'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PRODUCT_VARIANT_UPDATE', entityType: 'Product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_variant_dto_1.UpdateVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateVariant", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PRODUCT_IMAGE_UPLOAD', entityType: 'Product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, audit_log_decorator_1.AuditLog)({ action: 'PRODUCT_IMAGE_DELETE', entityType: 'Product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeImage", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('merchandise'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ORDERS_MANAGE),
    (0, common_1.Controller)('merchandise/products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map