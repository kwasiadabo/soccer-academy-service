import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { TENANT_SCOPED_MODELS } from './tenant-scoped-models';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly tenantContext: TenantContextService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.applyTenantScoping();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Wraps every operation on a tenant-scoped model in a two-statement transaction:
  // first SET LOCAL the current request's academy as a Postgres session variable,
  // then the real query. The row-level-security policy on every scoped table (see
  // the academy_rls migration) reads that session variable, so this scopes every
  // ORM call — and, since RLS is enforced by Postgres itself, any raw SQL too —
  // with no changes needed at any of the ~20 existing call sites across the app.
  //
  // Fails closed: TenantContextService.getAcademyId() throws if no tenant context
  // is set, so a forgotten tenantContext.run() (a cron job, say) blocks the query
  // outright rather than letting it run unscoped.
  private applyTenantScoping() {
    const base: PrismaClient = this;
    const tenantContext = this.tenantContext;

    const extended = base.$extends({
      name: 'tenant-scoping',
      query: {
        $allModels: {
          async $allOperations({ model, args, query }) {
            if (!model || !TENANT_SCOPED_MODELS.has(model)) {
              return query(args);
            }
            const academyId = tenantContext.getAcademyId();
            const [, result] = await base.$transaction([
              base.$executeRaw`SELECT set_config('app.current_academy_id', ${academyId}, true)`,
              query(args),
            ]);
            return result;
          },
        },
      },
    });

    for (const modelName of TENANT_SCOPED_MODELS) {
      const propertyName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
      Object.defineProperty(this, propertyName, {
        get: () => (extended as unknown as Record<string, unknown>)[propertyName],
        configurable: true,
      });
    }
  }
}
