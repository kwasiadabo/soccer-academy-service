"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAnyPermission = exports.RequirePermissions = exports.ANY_PERMISSIONS_KEY = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'required_permissions';
exports.ANY_PERMISSIONS_KEY = 'required_any_permissions';
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;
const RequireAnyPermission = (...permissions) => (0, common_1.SetMetadata)(exports.ANY_PERMISSIONS_KEY, permissions);
exports.RequireAnyPermission = RequireAnyPermission;
//# sourceMappingURL=permissions.decorator.js.map