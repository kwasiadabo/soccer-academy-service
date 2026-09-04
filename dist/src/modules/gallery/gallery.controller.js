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
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_constants_1 = require("../rbac/permissions.constants");
const audit_log_decorator_1 = require("../audit/audit-log.decorator");
const gallery_service_1 = require("./gallery.service");
const replace_gallery_photos_dto_1 = require("./dto/replace-gallery-photos.dto");
let GalleryController = class GalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    getPublic() {
        return this.galleryService.findPublic();
    }
    replacePhotos(context, files, dto, user) {
        return this.galleryService.replaceForContext(context, files, dto.sessionDate, dto.details, user.userId);
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getPublic", null);
__decorate([
    (0, common_1.Post)(':context/photos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.GALLERY_MANAGE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20)),
    (0, audit_log_decorator_1.AuditLog)({ action: 'GALLERY_PHOTOS_REPLACE', entityType: 'GalleryPhoto' }),
    __param(0, (0, common_1.Param)('context', new common_1.ParseEnumPipe(client_1.GalleryPhotoContext))),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, replace_gallery_photos_dto_1.ReplaceGalleryPhotosDto, Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "replacePhotos", null);
exports.GalleryController = GalleryController = __decorate([
    (0, swagger_1.ApiTags)('gallery'),
    (0, common_1.Controller)('gallery'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);
//# sourceMappingURL=gallery.controller.js.map