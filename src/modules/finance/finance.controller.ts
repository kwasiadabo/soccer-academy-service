import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { FinanceService } from './finance.service';
import { AddFeeTypeItemDto, CreateFeeTypeDto, UpdateFeeTypeDto } from './dto/fee-type.dto';
import { CreateFeeItemDto, UpdateFeeItemDto } from './dto/fee-item.dto';
import { CreateInvoiceDto } from './dto/invoice.dto';
import { CreatePaymentDto } from './dto/payment.dto';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('fee-items')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  findAllFeeItems(@Query('includeInactive') includeInactive?: string) {
    return this.financeService.findAllFeeItems(includeInactive === 'true');
  }

  @Post('fee-items')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'FEE_ITEM_CREATE', entityType: 'FeeItem' })
  createFeeItem(@Body() dto: CreateFeeItemDto) {
    return this.financeService.createFeeItem(dto);
  }

  @Patch('fee-items/:id')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'FEE_ITEM_UPDATE', entityType: 'FeeItem' })
  updateFeeItem(@Param('id') id: string, @Body() dto: UpdateFeeItemDto) {
    return this.financeService.updateFeeItem(id, dto);
  }

  @Get('fee-types')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  findAllFeeTypes(@Query('includeInactive') includeInactive?: string) {
    return this.financeService.findAllFeeTypes(includeInactive === 'true');
  }

  @Post('fee-types')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'FEE_TYPE_CREATE', entityType: 'FeeType' })
  createFeeType(@Body() dto: CreateFeeTypeDto) {
    return this.financeService.createFeeType(dto);
  }

  @Patch('fee-types/:id')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'FEE_TYPE_UPDATE', entityType: 'FeeType' })
  updateFeeType(@Param('id') id: string, @Body() dto: UpdateFeeTypeDto) {
    return this.financeService.updateFeeType(id, dto);
  }

  @Post('fee-types/:id/items')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'FEE_TYPE_ITEM_ADD', entityType: 'FeeType' })
  addFeeTypeItem(@Param('id') id: string, @Body() dto: AddFeeTypeItemDto) {
    return this.financeService.addFeeTypeItem(id, dto.feeItemId);
  }

  @Delete('fee-types/:id/items/:feeItemId')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'FEE_TYPE_ITEM_REMOVE', entityType: 'FeeType' })
  removeFeeTypeItem(@Param('id') id: string, @Param('feeItemId') feeItemId: string) {
    return this.financeService.removeFeeTypeItem(id, feeItemId);
  }

  @Get('stats/teams')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  getTeamStats() {
    return this.financeService.getTeamStats();
  }

  @Get('invoices/debtors')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  listDebtors() {
    return this.financeService.listDebtors();
  }

  @Get('invoices/debtors/aging')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  getDebtorsAging(@Query('minMonths') minMonths?: string) {
    return this.financeService.getDebtorsAging(minMonths ? Number(minMonths) : 0);
  }

  @Get('payments/report')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  getPaymentsReport(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('feeTypeId') feeTypeId?: string,
    @Query('playerId') playerId?: string,
  ) {
    return this.financeService.getPaymentsReport(from, to, feeTypeId, playerId);
  }

  @Get('invoices/monthly-billing')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  getMonthlyBilling(@Query('month') month?: string) {
    return this.financeService.getMonthlyBilling(month);
  }

  @Get('invoices')
  @RequirePermissions(PERMISSIONS.FINANCE_VIEW)
  findInvoicesForPlayer(@Query('playerId') playerId: string) {
    return this.financeService.findInvoicesForPlayer(playerId);
  }

  @Post('invoices')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'INVOICE_CREATE', entityType: 'Invoice' })
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.financeService.createInvoice(dto);
  }

  @Post('payments')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'PAYMENT_CREATE', entityType: 'Payment' })
  createPayment(@Body() dto: CreatePaymentDto, @CurrentUser() user: RequestUser) {
    return this.financeService.createPayment(dto, user.userId);
  }

  @Post('recurring-invoices/run')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'RECURRING_INVOICES_RUN', entityType: 'Invoice' })
  runRecurringInvoices() {
    return this.financeService.generateRecurringInvoices();
  }

  @Post('invoices/:id/remind')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'PAYMENT_REMINDER_SENT', entityType: 'Invoice' })
  sendReminder(@Param('id') id: string, @Body('playerId') playerId: string) {
    return this.financeService.sendPaymentReminder(playerId, id);
  }
}
