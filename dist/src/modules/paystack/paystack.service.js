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
var PaystackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PaystackService = PaystackService_1 = class PaystackService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(PaystackService_1.name);
        this.secretKey = this.config.get('PAYSTACK_SECRET_KEY');
        this.currency = this.config.get('PAYSTACK_CURRENCY', 'GHS');
    }
    assertConfigured() {
        if (!this.secretKey) {
            throw new common_1.BadRequestException('Paystack is not configured on this server');
        }
        return this.secretKey;
    }
    async chargeMobileMoney(params) {
        const secretKey = this.assertConfigured();
        const response = await fetch('https://api.paystack.co/charge', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: params.email,
                amount: Math.round(params.amount * 100),
                currency: this.currency,
                reference: params.reference,
                mobile_money: { phone: params.phone, provider: params.provider },
            }),
        });
        const body = (await response.json());
        if (!response.ok || !body.status || !body.data) {
            this.logger.warn(`Paystack charge failed: ${JSON.stringify(body)}`);
            throw new common_1.BadRequestException(body.message ?? 'Paystack charge could not be initiated');
        }
        return {
            reference: body.data.reference,
            status: body.data.status,
            displayText: body.data.display_text ?? null,
        };
    }
    async verifyTransaction(reference) {
        const secretKey = this.assertConfigured();
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: { Authorization: `Bearer ${secretKey}` },
        });
        const body = (await response.json());
        if (!response.ok || !body.status || !body.data) {
            throw new common_1.BadRequestException(body.message ?? 'Could not verify Paystack transaction');
        }
        return { status: body.data.status, amount: body.data.amount / 100 };
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = PaystackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map