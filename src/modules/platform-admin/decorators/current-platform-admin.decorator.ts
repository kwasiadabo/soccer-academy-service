import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedPlatformAdminRequest, RequestPlatformAdmin } from '../platform-admin.types';

export const CurrentPlatformAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestPlatformAdmin | undefined => {
    const request = ctx.switchToHttp().getRequest<Request & AuthenticatedPlatformAdminRequest>();
    return request.platformAdmin;
  },
);
