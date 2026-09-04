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
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.apiKey = this.config.get('NALO_API_KEY');
        this.senderId = this.config.get('NALO_SENDER_ID') ?? 'Kapikids';
        this.endpoint =
            this.config.get('NALO_ENDPOINT') ??
                'https://sms.nalosolutions.com/smsbackend/Resl_Nalo/send-message/';
    }
    async send(phone, message) {
        if (!this.apiKey) {
            this.logger.warn('SMS not configured (NALO_API_KEY missing) — skipping send');
            return false;
        }
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: this.apiKey,
                    msisdn: toGhanaMsisdn(phone),
                    message,
                    sender_id: this.senderId,
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
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map