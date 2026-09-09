import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@ApiTags('merchandise')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.ORDERS_MANAGE)
@Controller('merchandise/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products, including inactive ones.' })
  @ApiOkResponse({ description: 'Products returned.' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID.' })
  @ApiOkResponse({ description: 'Product returned.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // Binary image fetches shouldn't compete with the shared API-wide rate limit.
  @SkipThrottle()
  @Get(':id/images/:imageId')
  @ApiOperation({ summary: 'Get a product image (binary response).' })
  @ApiOkResponse({ description: 'Image bytes returned.' })
  async getImage(@Param('id') id: string, @Param('imageId') imageId: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.productsService.getImage(id, imageId);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.send(buffer);
  }

  @Post()
  @ApiOperation({ summary: 'Create a product.' })
  @ApiCreatedResponse({ description: 'Product created.' })
  @AuditLog({ action: 'PRODUCT_CREATE', entityType: 'Product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product.' })
  @ApiOkResponse({ description: 'Product updated.' })
  @AuditLog({ action: 'PRODUCT_UPDATE', entityType: 'Product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Post(':id/variants')
  @ApiOperation({ summary: 'Add a variant (e.g. size) to a product.' })
  @ApiCreatedResponse({ description: 'Variant created.' })
  @AuditLog({ action: 'PRODUCT_VARIANT_CREATE', entityType: 'Product' })
  addVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.productsService.addVariant(id, dto);
  }

  @Patch(':id/variants/:variantId')
  @ApiOperation({ summary: 'Update a product variant.' })
  @ApiOkResponse({ description: 'Variant updated.' })
  @AuditLog({ action: 'PRODUCT_VARIANT_UPDATE', entityType: 'Product' })
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(id, variantId, dto);
  }

  @Post(':id/images')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a product image.' })
  @ApiCreatedResponse({ description: 'Image uploaded.' })
  @AuditLog({ action: 'PRODUCT_IMAGE_UPLOAD', entityType: 'Product' })
  addImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: RequestUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.productsService.addImage(id, file, user.userId);
  }

  @Delete(':id/images/:imageId')
  @ApiOperation({ summary: 'Remove a product image.' })
  @ApiOkResponse({ description: 'Image removed.' })
  @AuditLog({ action: 'PRODUCT_IMAGE_DELETE', entityType: 'Product' })
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.removeImage(id, imageId);
  }
}
