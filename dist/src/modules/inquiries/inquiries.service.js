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
exports.InquiriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
let InquiriesService = class InquiriesService {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
    }
    create(dto) {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.publicInquiry.create({
            data: {
                academyId,
                childFirstName: dto.childFirstName,
                childLastName: dto.childLastName,
                childDateOfBirth: dto.childDateOfBirth ? new Date(dto.childDateOfBirth) : undefined,
                guardianName: dto.guardianName,
                guardianPhone: dto.guardianPhone,
                guardianEmail: dto.guardianEmail,
                preferredProgram: dto.preferredProgram,
                message: dto.message,
            },
        });
    }
    findAll() {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.publicInquiry.findMany({ where: { academyId }, orderBy: { createdAt: 'desc' } });
    }
    async updateStatus(id, dto) {
        const academyId = this.tenantContext.getAcademyId();
        const inquiry = await this.prisma.publicInquiry.findFirst({ where: { id, academyId } });
        if (!inquiry) {
            throw new common_1.NotFoundException('Inquiry not found');
        }
        return this.prisma.publicInquiry.update({ where: { id, academyId }, data: { status: dto.status } });
    }
};
exports.InquiriesService = InquiriesService;
exports.InquiriesService = InquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], InquiriesService);
//# sourceMappingURL=inquiries.service.js.map