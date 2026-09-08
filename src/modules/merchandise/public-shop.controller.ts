import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuditLog } from '../audit/audit-log.decorator';
import { ProductsService } from './products.service';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';

// Public marketing-site storefront — unauthenticated by design, same active-only
// catalog the parent portal shows (see MyShopController), so a visitor can browse
// products and place an order for a player without creating an account. The player
// is matched by their unique player code only — never by a public name/roster search
// — so this never exposes a listable roster of children to an anonymous visitor.
@ApiTags('shop')
@Controller('shop')
export class PublicShopController {
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

  // A storefront grid can fire dozens of image requests at once — shouldn't
  // compete with the shared API-wide rate limit meant for normal request traffic.
  @SkipThrottle()
  @Get('products/:id/images/:imageId')
  async getProductImage(@Param('id') id: string, @Param('imageId') imageId: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.productsService.getImage(id, imageId);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(buffer);
  }

  @Get('players/lookup')
  lookupPlayer(@Query('code') code: string) {
    return this.ordersService.lookupPlayerByCode(code);
  }

  @Post('orders')
  @AuditLog({ action: 'MERCHANDISE_ORDER_CREATE', entityType: 'MerchandiseOrder' })
  createOrder(@Body() dto: CreateGuestOrderDto) {
    return this.ordersService.createGuestOrder(dto);
  }
}
