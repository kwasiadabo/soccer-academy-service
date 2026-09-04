import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ANY_PERMISSIONS_KEY, PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionKey } from '../../rbac/permissions.constants';
import { AuthenticatedRequest } from '../types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAll = this.reflector.getAllAndOverride<PermissionKey[] | undefined>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredAny = this.reflector.getAllAndOverride<PermissionKey[] | undefined>(
      ANY_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if ((!requiredAll || requiredAll.length === 0) && (!requiredAny || requiredAny.length === 0)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & AuthenticatedRequest>();
    const userPermissions = request.user?.permissions ?? [];

    if (requiredAll && requiredAll.length > 0) {
      const hasAll = requiredAll.every((permission) => userPermissions.includes(permission));
      if (!hasAll) {
        throw new ForbiddenException('You do not have permission to perform this action');
      }
    }

    if (requiredAny && requiredAny.length > 0) {
      const hasAny = requiredAny.some((permission) => userPermissions.includes(permission));
      if (!hasAny) {
        throw new ForbiddenException('You do not have permission to perform this action');
      }
    }

    return true;
  }
}
