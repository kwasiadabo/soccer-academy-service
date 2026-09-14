import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../src/common/tenant-context/tenant-context.service';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { TENANT_SCOPED_MODELS } from '../src/modules/prisma/tenant-scoped-models';

function delegateName(modelName: string): string {
  return modelName.charAt(0).toLowerCase() + modelName.slice(1);
}

// Deletes every row a test academy owns, then the academy itself — used by
// every e2e suite that onboards or directly inserts a throwaway academy, so
// dev/CI databases don't accumulate leftover rows run after run.
//
// Doesn't hardcode a deletion order: which tenant-scoped tables a given test
// actually populated (and how they reference each other) varies per suite and
// is easy to get subtly wrong (see the AuditLog surprise this replaced) or to
// leave stale as a test grows. Instead it repeatedly sweeps every table in
// TENANT_SCOPED_MODELS, deleting whatever isn't blocked by a foreign key yet,
// until a full pass makes no progress — which naturally resolves any
// dependency order without needing to know the schema's FK graph.
export async function deleteAcademyCompletely(
  prisma: PrismaService,
  tenantContext: TenantContextService,
  bareClient: PrismaClient,
  academyId: string,
  slug: string,
): Promise<void> {
  await tenantContext.run({ academyId, slug }, async () => {
    const remaining = new Set(TENANT_SCOPED_MODELS);
    while (remaining.size > 0) {
      let progressed = false;
      for (const model of remaining) {
        const delegate = (prisma as unknown as Record<string, { deleteMany: (args: unknown) => Promise<unknown> }>)[
          delegateName(model)
        ];
        try {
          await delegate.deleteMany({ where: { academyId } });
          remaining.delete(model);
          progressed = true;
        } catch {
          // Still referenced by another not-yet-deleted table — retry next pass.
        }
      }
      if (!progressed) {
        throw new Error(
          `deleteAcademyCompletely: stuck with rows remaining in [${Array.from(remaining).join(', ')}] for academy ${academyId}`,
        );
      }
    }
  });

  // AcademySettings sits outside TENANT_SCOPED_MODELS (it's cascade-deleted via
  // its own FK, not RLS-protected) and Academy itself is the tenant root — both
  // plain, unscoped deletes.
  await bareClient.academy.delete({ where: { id: academyId } });
}
