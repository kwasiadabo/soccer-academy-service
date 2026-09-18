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
exports.ParentPortalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const guardian_context_service_1 = require("../guardians/guardian-context.service");
const storage_service_1 = require("../storage/storage.service");
const finance_utils_1 = require("../finance/finance.utils");
const CHILD_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    playerCode: true,
    status: true,
    dateOfBirth: true,
    photoDocumentId: true,
    ageCategory: { select: { id: true, name: true } },
    team: { select: { id: true, name: true } },
};
let ParentPortalService = class ParentPortalService {
    constructor(prisma, guardianContext, storage, tenantContext) {
        this.prisma = prisma;
        this.guardianContext = guardianContext;
        this.storage = storage;
        this.tenantContext = tenantContext;
    }
    async listChildren(userId) {
        const academyId = this.tenantContext.getAcademyId();
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        const playerIds = await this.guardianContext.resolvePlayerIds(guardianId);
        return this.prisma.player.findMany({
            where: { id: { in: playerIds }, academyId, deletedAt: null },
            select: CHILD_SELECT,
            orderBy: { firstName: 'asc' },
        });
    }
    async getPlayerOfTheWeekAwards(userId) {
        const academyId = this.tenantContext.getAcademyId();
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        const playerIds = await this.guardianContext.resolvePlayerIds(guardianId);
        if (playerIds.length === 0)
            return [];
        return this.prisma.playerOfTheWeek.findMany({
            where: { playerId: { in: playerIds }, academyId },
            include: { team: { select: { name: true } } },
            orderBy: { weekOf: 'desc' },
            take: 20,
        });
    }
    async assertAccess(userId, playerId) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        await this.guardianContext.assertOwnsPlayer(guardianId, playerId);
        return guardianId;
    }
    async getChild(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.player.findFirstOrThrow({ where: { id: playerId, academyId }, select: CHILD_SELECT });
    }
    async getPhoto(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirst({
            where: { id: playerId, academyId, deletedAt: null },
            include: { photo: true },
        });
        if (!player?.photo) {
            throw new common_1.NotFoundException('This player has no photo');
        }
        const buffer = await this.storage.read(player.photo.storageKey);
        return { buffer, mimeType: player.photo.mimeType };
    }
    async getCoaches(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirstOrThrow({
            where: { id: playerId, academyId },
            select: { teamId: true, trainingGroupId: true, primaryCoachId: true },
        });
        const assignments = await this.prisma.coachAssignment.findMany({
            where: {
                academyId,
                effectiveTo: null,
                OR: [
                    player.teamId ? { teamId: player.teamId } : undefined,
                    player.trainingGroupId ? { trainingGroupId: player.trainingGroupId } : undefined,
                ].filter((c) => !!c),
            },
            select: { coach: { select: { id: true, firstName: true, lastName: true } } },
        });
        const coaches = new Map(assignments.map((a) => [a.coach.id, a.coach]));
        if (player.primaryCoachId) {
            const primaryCoach = await this.prisma.coach.findFirst({
                where: { id: player.primaryCoachId, academyId },
                select: { id: true, firstName: true, lastName: true },
            });
            if (primaryCoach)
                coaches.set(primaryCoach.id, primaryCoach);
        }
        return Array.from(coaches.values());
    }
    async getAttendance(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.trainingAttendance.findMany({
            where: { playerId, academyId },
            include: { trainingSession: { include: { team: true } } },
            orderBy: { recordedAt: 'desc' },
            take: 50,
        });
    }
    async getAssessments(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.playerAssessment.findMany({
            where: { playerId, academyId, deletedAt: null },
            include: {
                ratings: { include: { criteria: true, sessionActivity: true } },
                assessedByCoach: { select: { id: true, firstName: true, lastName: true } },
                template: true,
            },
            orderBy: { assessmentDate: 'desc' },
            take: 50,
        });
    }
    async getActivityMarks(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.trainingActivityMark.findMany({
            where: { playerId, academyId },
            include: {
                trainingActivity: {
                    select: { name: true, trainingPlan: { select: { title: true, scheduledDate: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getMatches(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.matchParticipation.findMany({
            where: { playerId, academyId },
            include: { match: { include: { team: true, opponent: true } } },
            orderBy: { match: { matchDate: 'desc' } },
            take: 50,
        });
    }
    async getFinanceSummary(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        const invoices = await this.prisma.invoice.findMany({
            where: { playerId, academyId, deletedAt: null },
            include: { allocations: true },
        });
        const payments = await this.prisma.payment.findMany({
            where: { playerId, academyId, status: 'COMPLETED' },
        });
        let totalDue = 0;
        let nextDueDate = null;
        let hasOverdue = false;
        const now = new Date();
        for (const invoice of invoices) {
            const remaining = (0, finance_utils_1.computeRemainingBalance)(invoice);
            if (remaining > 0.01) {
                totalDue += remaining;
                if (!nextDueDate || invoice.dueDate < nextDueDate) {
                    nextDueDate = invoice.dueDate;
                }
                if (invoice.dueDate < now) {
                    hasOverdue = true;
                }
            }
        }
        const paidToDate = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const status = totalDue <= 0.01 ? 'UP_TO_DATE' : hasOverdue ? 'OVERDUE' : 'PENDING';
        return {
            totalDue: Math.round(totalDue * 100) / 100,
            paidToDate: Math.round(paidToDate * 100) / 100,
            nextDueDate,
            status,
        };
    }
    async getStatement(userId, playerId) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        const invoices = await this.prisma.invoice.findMany({
            where: { playerId, academyId, deletedAt: null },
            include: { feeType: true, allocations: true },
            orderBy: { issuedAt: 'asc' },
        });
        const paymentAllocations = await this.prisma.paymentAllocation.findMany({
            where: { academyId, payment: { playerId, status: 'COMPLETED' } },
            include: {
                payment: true,
                invoice: { include: { feeType: true } },
            },
            orderBy: { payment: { paidAt: 'asc' } },
        });
        return {
            invoices: invoices.map((invoice) => ({
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                issuedAt: invoice.issuedAt,
                dueDate: invoice.dueDate,
                amount: Number(invoice.amount),
                discountAmount: Number(invoice.discountAmount),
                remaining: (0, finance_utils_1.computeRemainingBalance)(invoice),
                status: invoice.status,
                feeTypeName: invoice.feeType.name,
            })),
            payments: paymentAllocations.map((a) => ({
                paymentId: a.payment.id,
                invoiceId: a.invoice.id,
                receiptNumber: a.payment.receiptNumber,
                paidAt: a.payment.paidAt,
                method: a.payment.method,
                amount: Number(a.amount),
                feeTypeName: a.invoice.feeType.name,
                invoiceNumber: a.invoice.invoiceNumber,
            })),
        };
    }
    async submitFeedback(userId, playerId, dto) {
        await this.assertAccess(userId, playerId);
        const academyId = this.tenantContext.getAcademyId();
        const { criteria, ...rest } = dto;
        return this.prisma.coachFeedback.create({
            data: {
                ...rest,
                academyId,
                playerId,
                submittedByUserId: userId,
                criteria: criteria?.length ? { create: criteria } : undefined,
            },
            include: { criteria: true },
        });
    }
};
exports.ParentPortalService = ParentPortalService;
exports.ParentPortalService = ParentPortalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        guardian_context_service_1.GuardianContextService,
        storage_service_1.StorageService,
        tenant_context_service_1.TenantContextService])
], ParentPortalService);
//# sourceMappingURL=parent-portal.service.js.map