import { ForbiddenException, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AcademiesService } from '../../modules/academies/academies.service';
import { TenantContextService } from '../tenant-context/tenant-context.service';

const ACADEMY_SLUG_HEADER = 'x-academy-slug';

// Resolves which academy a request belongs to and runs the rest of the
// request inside that academy's tenant context. Two resolution paths:
//
//  1. `X-Academy-Slug` header — explicit override, always wins. Used in local
//     development against plain `localhost` (which has no subdomain to parse)
//     and for tooling/tests that don't want to fuss with DNS.
//  2. The `Host` header's leftmost label, e.g. `kapikids.sams.app` -> `kapikids`
//     (also works against `kapikids.lvh.me`, which resolves to 127.0.0.1, for
//     realistic subdomain testing in local dev).
//
// A host with no parseable subdomain (`localhost`, an apex domain, a bare IP)
// and no override header cannot be resolved to a tenant — treated as a client
// error rather than silently falling back to some default academy.
function extractSlug(req: Request): string | null {
  const headerSlug = req.headers[ACADEMY_SLUG_HEADER];
  if (typeof headerSlug === 'string' && headerSlug.trim() !== '') {
    return headerSlug.trim();
  }

  const host = req.headers.host ?? '';
  const hostname = host.split(':')[0];
  const labels = hostname.split('.');
  if (labels.length > 2) {
    return labels[0];
  }
  return null;
}

@Injectable()
export class TenantResolutionMiddleware implements NestMiddleware {
  constructor(
    private readonly academies: AcademiesService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const slug = extractSlug(req);
    if (!slug) {
      throw new NotFoundException(
        'Could not determine which academy this request belongs to. ' +
          'Use a subdomain (e.g. kapikids.sams.app) or, in development, an X-Academy-Slug header.',
      );
    }

    const academy = await this.academies.findBySlug(slug);
    if (!academy) {
      throw new NotFoundException(`No academy found for '${slug}'`);
    }
    if (academy.status === 'PAST_DUE') {
      throw new ForbiddenException(
        "This academy's SAMS subscription has expired. Please make payment to restore access.",
      );
    }
    if (academy.status !== 'ACTIVE') {
      throw new ForbiddenException('This academy is not currently active');
    }

    this.tenantContext.run({ academyId: academy.id, slug: academy.slug }, () => next());
  }
}
