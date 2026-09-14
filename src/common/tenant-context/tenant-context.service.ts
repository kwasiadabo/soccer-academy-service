import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

interface TenantStore {
  academyId: string;
  slug: string;
}

// Carries the current request's academy across the whole async call chain
// (guards -> controller -> service -> Prisma) without threading it through
// every method signature. Read by the tenant-scoping Prisma extension, and by
// anything (like StorageService) that needs the academy's slug rather than its id.
//
// getAcademyId()/getSlug() fail closed: any code path that reads either
// without first running inside `run()` throws immediately, rather than
// silently proceeding unscoped — for a multi-tenant system a loud failure here
// is far preferable to a quiet cross-academy data leak.
@Injectable()
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<TenantStore>();

  run<T>(tenant: TenantStore, fn: () => T): T {
    return this.storage.run(tenant, fn);
  }

  private getStoreOrThrow(): TenantStore {
    const store = this.storage.getStore();
    if (!store) {
      throw new Error(
        'TenantContextService read outside of a tenant context — ' +
          'wrap this code path in tenantContext.run({ academyId, slug }, ...) first.',
      );
    }
    return store;
  }

  getAcademyId(): string {
    return this.getStoreOrThrow().academyId;
  }

  getSlug(): string {
    return this.getStoreOrThrow().slug;
  }

  hasContext(): boolean {
    return this.storage.getStore() !== undefined;
  }
}
