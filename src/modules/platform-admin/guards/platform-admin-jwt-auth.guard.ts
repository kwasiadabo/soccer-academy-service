import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthenticatedPlatformAdminRequest, RequestPlatformAdmin } from '../platform-admin.types';

// Attaches the authenticated result to `request.platformAdmin` rather than the
// conventional `request.user` — keeping it unambiguously separate from the
// per-academy JwtStrategy's result, even in code that doesn't check which
// guard ran.
@Injectable()
export class PlatformAdminAuthGuard extends AuthGuard('platform-jwt') {
  handleRequest<TUser = RequestPlatformAdmin>(
    err: unknown,
    user: RequestPlatformAdmin | false,
    _info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw err instanceof Error ? err : new UnauthorizedException();
    }
    const request = context.switchToHttp().getRequest<Request & AuthenticatedPlatformAdminRequest>();
    request.platformAdmin = user;
    return user as TUser;
  }
}
