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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailService_1.name);
        const user = this.config.get('EMAIL_USER');
        const pass = this.config.get('EMAIL_APP_PASSWORD');
        this.fromAddress = user;
        this.transporter =
            user && pass ? nodemailer_1.default.createTransport({ service: 'gmail', auth: { user, pass } }) : null;
    }
    async send(params) {
        if (!this.transporter) {
            this.logger.warn('Email not configured (EMAIL_USER/EMAIL_APP_PASSWORD missing) — skipping send');
            return false;
        }
        try {
            const info = await this.transporter.sendMail({
                from: `Kapikids Soccer Academy <${this.fromAddress}>`,
                to: params.to,
                subject: params.subject,
                html: params.html,
                attachments: params.attachments,
            });
            this.logger.log(`Email sent to ${params.to}: ${info.messageId}`);
            return true;
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${params.to}: ${err.message}`);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map