"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardiansModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const guardians_controller_1 = require("./guardians.controller");
const guardians_service_1 = require("./guardians.service");
const guardian_context_service_1 = require("./guardian-context.service");
let GuardiansModule = class GuardiansModule {
};
exports.GuardiansModule = GuardiansModule;
exports.GuardiansModule = GuardiansModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [guardians_controller_1.GuardiansController],
        providers: [guardians_service_1.GuardiansService, guardian_context_service_1.GuardianContextService],
        exports: [guardian_context_service_1.GuardianContextService],
    })
], GuardiansModule);
//# sourceMappingURL=guardians.module.js.map