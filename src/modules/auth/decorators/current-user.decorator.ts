import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser, AuthenticatedRequest } from '../types';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser | undefined => {
    const request = ctx.switchToHttp().getRequest<Request & AuthenticatedRequest>();
    return request.user;
  },
);
