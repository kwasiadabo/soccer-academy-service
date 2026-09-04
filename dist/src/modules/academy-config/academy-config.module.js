"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademyConfigModule = void 0;
const common_1 = require("@nestjs/common");
const academy_config_controller_1 = require("./academy-config.controller");
const academy_config_service_1 = require("./academy-config.service");
let AcademyConfigModule = class AcademyConfigModule {
};
exports.AcademyConfigModule = AcademyConfigModule;
exports.AcademyConfigModule = AcademyConfigModule = __decorate([
    (0, common_1.Module)({
        controllers: [academy_config_controller_1.AcademyConfigController],
        providers: [academy_config_service_1.AcademyConfigService],
    })
], AcademyConfigModule);
//# sourceMappingURL=academy-config.module.js.map