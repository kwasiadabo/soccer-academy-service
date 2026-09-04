import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MerchandiseOrderStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

// Staff-facing: every parent-submitted merchandise order, gated by ORDERS_MANAGE
// (Admin, Receptionist, Head Coach).
@ApiTags('merchandise')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.ORDERS_MANAGE)
@Controller('merchandise/orders')
export class MerchandiseOrdersController {
  constructor(private readonly ordersService: MerchandiseOrdersService) {}

  @Get()
  listAll(@Query('status') status?: MerchandiseOrderStatus) {
    return this.ordersService.listAll(status);
  }

  @Get('pending-count')
  pendingCount() {
    return this.ordersService.pendingCount();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.ordersService.getForStaff(id);
  }

  @Patch(':id/status')
  @AuditLog({ action: 'MERCHANDISE_ORDER_STATUS_UPDATE', entityType: 'MerchandiseOrder' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status, dto.staffNotes);
  }
}
