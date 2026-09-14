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
const nodemailer_1 = __importDefault(require("nodemailer"));
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const prisma_service_1 = require("../prisma/prisma.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async send(params) {
        const academyId = this.tenantContext.getAcademyId();
        const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
        if (!settings?.emailUser || !settings?.emailAppPassword) {
            this.logger.warn(`Email not configured for academy ${academyId} — skipping send`);
            return false;
        }
        try {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: { user: settings.emailUser, pass: settings.emailAppPassword },
            });
            const info = await transporter.sendMail({
                from: `${settings.brandName} <${settings.emailUser}>`,
                to: params.to,
                subject: params.subject,
                html: params.html,
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], EmailService);
//# sourceMappingURL=email.service.js.map