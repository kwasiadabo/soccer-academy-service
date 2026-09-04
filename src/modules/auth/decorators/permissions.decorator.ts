import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from '../../rbac/permissions.constants';

export const PERMISSIONS_KEY = 'required_permissions';
export const ANY_PERMISSIONS_KEY = 'required_any_permissions';

/** Caller must have ALL of the given permissions. */
export const RequirePermissions = (...permissions: PermissionKey[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/** Caller must have AT LEAST ONE of the given permissions. */
export const RequireAnyPermission = (...permissions: PermissionKey[]) =>
  SetMetadata(ANY_PERMISSIONS_KEY, permissions);
