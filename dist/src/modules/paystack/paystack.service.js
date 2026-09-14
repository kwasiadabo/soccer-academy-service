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
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const prisma_service_1 = require("../prisma/prisma.service");
let PaystackService = PaystackService_1 = class PaystackService {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(PaystackService_1.name);
    }
    async getCredentials() {
        const academyId = this.tenantContext.getAcademyId();
        const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
        if (!settings?.paystackSecretKey) {
            throw new common_1.BadRequestException('Paystack is not configured for this academy');
        }
        return { secretKey: settings.paystackSecretKey, currency: settings.paystackCurrency };
    }
    async chargeMobileMoney(params) {
        const { secretKey, currency } = await this.getCredentials();
        const response = await fetch('https://api.paystack.co/charge', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: params.email,
                amount: Math.round(params.amount * 100),
                currency,
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
        const { secretKey } = await this.getCredentials();
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map