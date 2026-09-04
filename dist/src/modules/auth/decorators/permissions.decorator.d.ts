import { PermissionKey } from '../../rbac/permissions.constants';
export declare const PERMISSIONS_KEY = "required_permissions";
export declare const ANY_PERMISSIONS_KEY = "required_any_permissions";
export declare const RequirePermissions: (...permissions: PermissionKey[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireAnyPermission: (...permissions: PermissionKey[]) => import("@nestjs/common").CustomDecorator<string>;
