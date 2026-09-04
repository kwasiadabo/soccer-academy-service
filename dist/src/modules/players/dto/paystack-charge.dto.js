"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPaystackChargeDto = exports.InitiatePaystackChargeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const MOMO_PROVIDERS = ['mtn', 'vod', 'tgo'];
class InitiatePaystackChargeDto {
}
exports.InitiatePaystackChargeDto = InitiatePaystackChargeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mobile money number to charge, e.g. 0244123456' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiatePaystackChargeDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: MOMO_PROVIDERS, description: 'mtn = MTN, vod = Vodafone/Telecel, tgo = AirtelTigo' }),
    (0, class_validator_1.IsIn)(MOMO_PROVIDERS),
    __metadata("design:type", String)
], InitiatePaystackChargeDto.prototype, "provider", void 0);
class VerifyPaystackChargeDto {
}
exports.VerifyPaystackChargeDto = VerifyPaystackChargeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyPaystackChargeDto.prototype, "reference", void 0);
//# sourceMappingURL=paystack-charge.dto.js.map