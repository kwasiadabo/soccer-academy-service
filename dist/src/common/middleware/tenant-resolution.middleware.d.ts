import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AcademiesService } from '../../modules/academies/academies.service';
import { TenantContextService } from '../tenant-context/tenant-context.service';
export declare class TenantResolutionMiddleware implements NestMiddleware {
    private readonly academies;
    private readonly tenantContext;
    constructor(academies: AcademiesService, tenantContext: TenantContextService);
    use(req: Request, _res: Response, next: NextFunction): Promise<void>;
}
