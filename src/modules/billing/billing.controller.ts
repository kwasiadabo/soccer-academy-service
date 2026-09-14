import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { BillingService } from './billing.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@ApiTags('billing')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('subscription')
  @RequirePermissions(PERMISSIONS.BILLING_MANAGE)
  @ApiOperation({ summary: "This academy's SAMS subscription status." })
  @ApiOkResponse({ description: 'Subscription status returned.' })
  getSubscription() {
    return this.billing.getSubscriptionStatus();
  }

  @Post('payment/initialize')
  @RequirePermissions(PERMISSIONS.BILLING_MANAGE)
  @ApiOperation({ summary: 'Start a Paystack checkout for the current amount due.' })
  @ApiOkResponse({ description: 'Paystack checkout URL returned.' })
  initializePayment(@CurrentUser() user: RequestUser, @Body() dto: InitializePaymentDto) {
    return this.billing.initializePayment(user.email, dto.callbackUrl);
  }

  @Get('payment/verify')
  @RequirePermissions(PERMISSIONS.BILLING_MANAGE)
  @ApiOperation({ summary: 'Verify a completed Paystack checkout and apply it to the subscription.' })
  @ApiOkResponse({ description: 'Subscription status returned.' })
  verifyPayment(@Query('reference') reference: string) {
    return this.billing.verifyAndApplyPayment(reference);
  }
}
