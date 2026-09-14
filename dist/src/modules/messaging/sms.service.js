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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const prisma_service_1 = require("../prisma/prisma.service");
function toGhanaMsisdn(phone) {
    const digits = phone.replace(/[^\d+]/g, '');
    if (digits.startsWith('+233'))
        return digits.slice(1);
    if (digits.startsWith('233'))
        return digits;
    if (digits.startsWith('0'))
        return `233${digits.slice(1)}`;
    return digits;
}
let SmsService = SmsService_1 = class SmsService {
    constructor(config, prisma, tenantContext) {
        this.config = config;
        this.prisma = prisma;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.endpoint =
            this.config.get('NALO_ENDPOINT') ??
                'https://sms.nalosolutions.com/smsbackend/Resl_Nalo/send-message/';
    }
    async send(phone, message) {
        const academyId = this.tenantContext.getAcademyId();
        const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
        if (!settings?.smsApiKey) {
            this.logger.warn(`SMS not configured for academy ${academyId} — skipping send`);
            return false;
        }
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: settings.smsApiKey,
                    msisdn: toGhanaMsisdn(phone),
                    message,
                    sender_id: settings.smsSenderId ?? settings.brandName,
                    type: '0',
                }),
            });
            const body = await response.text();
            this.logger.log(`Nalo SMS response for ${phone}: HTTP ${response.status} — ${body}`);
            return response.ok;
        }
        catch (err) {
            this.logger.error(`Failed to send SMS to ${phone}: ${err.message}`);
            return false;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], SmsService);
//# sourceMappingURL=sms.service.js.map