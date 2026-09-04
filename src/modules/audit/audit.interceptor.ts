import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AuditService } from './audit.service';
import { AUDIT_LOG_KEY, AuditLogMeta } from './audit-log.decorator';
import { AuthenticatedRequest } from '../auth/types';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.get<AuditLogMeta | undefined>(AUDIT_LOG_KEY, context.getHandler());
    if (!meta) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request & AuthenticatedRequest>();

    return next.handle().pipe(
      tap((result) => {
        const entityId =
          (result as { id?: string } | undefined)?.id ?? (request.params?.id as string | undefined) ?? null;

        void this.auditService.record({
          actorUserId: request.user?.userId ?? null,
          action: meta.action,
          entityType: meta.entityType,
          entityId,
          afterData: result,
          ipAddress: request.ip ?? null,
        });
      }),
    );
  }
}
