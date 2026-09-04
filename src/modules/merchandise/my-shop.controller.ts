import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { ProductsService } from './products.service';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

// Parent-facing: browse the active catalog and manage this guardian's own orders.
@ApiTags('parent-portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.PARENT_PORTAL_ACCESS)
@Controller('parent-portal/shop')
export class MyShopController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: MerchandiseOrdersService,
  ) {}

  @Get('products')
  listProducts() {
    return this.productsService.findAll(false);
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findOne(id, false);
  }

  // Binary image fetches — a shop grid can fire dozens at once, which shouldn't
  // compete with the shared API-wide rate limit meant for normal request traffic.
  @SkipThrottle()
  @Get('products/:id/images/:imageId')
  async getProductImage(@Param('id') id: string, @Param('imageId') imageId: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.productsService.getImage(id, imageId);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.send(buffer);
  }

  @Get('orders')
  listMyOrders(@CurrentUser() user: RequestUser) {
    return this.ordersService.listMine(user.userId);
  }

  @Get('orders/:id')
  getMyOrder(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.ordersService.getMine(user.userId, id);
  }

  @Post('orders')
  @AuditLog({ action: 'MERCHANDISE_ORDER_CREATE', entityType: 'MerchandiseOrder' })
  createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user: RequestUser) {
    return this.ordersService.createOrder(user.userId, dto);
  }
}
