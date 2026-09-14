import { Global, Module } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';

// Global so any module can inject TenantContextService without importing this
// module directly, matching the existing PrismaModule pattern.
@Global()
@Module({
  providers: [TenantContextService],
  exports: [TenantContextService],
})
export class TenantContextModule {}
