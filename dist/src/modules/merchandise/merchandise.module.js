"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchandiseModule = void 0;
const common_1 = require("@nestjs/common");
const guardians_module_1 = require("../guardians/guardians.module");
const storage_module_1 = require("../storage/storage.module");
const products_controller_1 = require("./products.controller");
const merchandise_orders_controller_1 = require("./merchandise-orders.controller");
const my_shop_controller_1 = require("./my-shop.controller");
const products_service_1 = require("./products.service");
const merchandise_orders_service_1 = require("./merchandise-orders.service");
let MerchandiseModule = class MerchandiseModule {
};
exports.MerchandiseModule = MerchandiseModule;
exports.MerchandiseModule = MerchandiseModule = __decorate([
    (0, common_1.Module)({
        imports: [guardians_module_1.GuardiansModule, storage_module_1.StorageModule],
        controllers: [products_controller_1.ProductsController, merchandise_orders_controller_1.MerchandiseOrdersController, my_shop_controller_1.MyShopController],
        providers: [products_service_1.ProductsService, merchandise_orders_service_1.MerchandiseOrdersService],
    })
], MerchandiseModule);
//# sourceMappingURL=merchandise.module.js.map