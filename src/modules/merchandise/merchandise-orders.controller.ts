import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.ORDERS_MANAGE)
@Controller('merchandise/orders')
export class MerchandiseOrdersController {
  constructor(private readonly ordersService: MerchandiseOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List merchandise orders, optionally filtered by status.' })
  @ApiOkResponse({ description: 'Orders returned.' })
  listAll(@Query('status') status?: MerchandiseOrderStatus) {
    return this.ordersService.listAll(status);
  }

  @Get('pending-count')
  @ApiOperation({ summary: 'Get the count of orders pending action.' })
  @ApiOkResponse({ description: 'Count returned.' })
  pendingCount() {
    return this.ordersService.pendingCount();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID.' })
  @ApiOkResponse({ description: 'Order returned.' })
  getOne(@Param('id') id: string) {
    return this.ordersService.getForStaff(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of an order.' })
  @ApiOkResponse({ description: 'Order updated.' })
  @AuditLog({ action: 'MERCHANDISE_ORDER_STATUS_UPDATE', entityType: 'MerchandiseOrder' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status, dto.staffNotes);
  }
}
