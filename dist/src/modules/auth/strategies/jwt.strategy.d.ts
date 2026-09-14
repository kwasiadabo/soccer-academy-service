import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { TenantContextService } from '../../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload, RequestUser } from '../types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    private readonly tenantContext;
    constructor(config: ConfigService, prisma: PrismaService, tenantContext: TenantContextService);
    validate(req: Request, payload: JwtPayload): Promise<RequestUser>;
}
export {};
