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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredAll = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        const requiredAny = this.reflector.getAllAndOverride(permissions_decorator_1.ANY_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if ((!requiredAll || requiredAll.length === 0) && (!requiredAny || requiredAny.length === 0)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userPermissions = request.user?.permissions ?? [];
        if (requiredAll && requiredAll.length > 0) {
            const hasAll = requiredAll.every((permission) => userPermissions.includes(permission));
            if (!hasAll) {
                throw new common_1.ForbiddenException('You do not have permission to perform this action');
            }
        }
        if (requiredAny && requiredAny.length > 0) {
            const hasAny = requiredAny.some((permission) => userPermissions.includes(permission));
            if (!hasAny) {
                throw new common_1.ForbiddenException('You do not have permission to perform this action');
            }
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map