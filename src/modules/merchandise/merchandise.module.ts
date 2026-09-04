import { Module } from '@nestjs/common';
import { GuardiansModule } from '../guardians/guardians.module';
import { StorageModule } from '../storage/storage.module';
import { ProductsController } from './products.controller';
import { MerchandiseOrdersController } from './merchandise-orders.controller';
import { MyShopController } from './my-shop.controller';
import { ProductsService } from './products.service';
import { MerchandiseOrdersService } from './merchandise-orders.service';

@Module({
  imports: [GuardiansModule, StorageModule],
  controllers: [ProductsController, MerchandiseOrdersController, MyShopController],
  providers: [ProductsService, MerchandiseOrdersService],
})
export class MerchandiseModule {}
