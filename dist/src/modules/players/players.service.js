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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const storage_service_1 = require("../storage/storage.service");
const paystack_service_1 = require("../paystack/paystack.service");
const coach_context_service_1 = require("../coaches/coach-context.service");
const player_id_service_1 = require("./player-id.service");
const finance_utils_1 = require("../finance/finance.utils");
const receipts_service_1 = require("../receipts/receipts.service");
const PROFILE_INCLUDE = {
    ageCategory: true,
    team: true,
    trainingGroup: true,
    primaryCoach: true,
    guardians: { include: { guardian: true } },
    registrations: { orderBy: { createdAt: 'desc' }, take: 1 },
};
const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
let PlayersService = class PlayersService {
    constructor(prisma, storage, playerIdService, paystack, receipts, coachContext, tenantContext) {
        this.prisma = prisma;
        this.storage = storage;
        this.playerIdService = playerIdService;
        this.paystack = paystack;
        this.receipts = receipts;
        this.coachContext = coachContext;
        this.tenantContext = tenantContext;
    }
    async findAll(filter, user) {
        const academyId = this.tenantContext.getAcademyId();
        const scopeFilter = await this.buildCoachScopeFilter(user);
        const players = await this.prisma.player.findMany({
            where: {
                academyId,
                deletedAt: null,
                status: filter.status ? filter.status : undefined,
                teamId: filter.teamId || undefined,
                AND: [
                    filter.search
                        ? {
                            OR: [
                                { firstName: { contains: filter.search, mode: 'insensitive' } },
                                { lastName: { contains: filter.search, mode: 'insensitive' } },
                                { playerCode: { contains: filter.search, mode: 'insensitive' } },
                            ],
                        }
                        : {},
                    scopeFilter,
                ],
            },
            include: { ageCategory: true, team: true, trainingGroup: true },
            orderBy: { createdAt: 'desc' },
        });
        return players;
    }
    async buildCoachScopeFilter(user) {
        if (!this.coachContext.isCoachOnly(user)) {
            return {};
        }
        const coachId = await this.coachContext.resolveCoachId(user.userId);
        const [teamIds, trainingGroupIds] = await Promise.all([
            this.coachContext.getAssignedTeamIds(coachId),
            this.coachContext.getAssignedTrainingGroupIds(coachId),
        ]);
        if (teamIds.length === 0 && trainingGroupIds.length === 0) {
            return { id: { in: [] } };
        }
        return {
            OR: [
                teamIds.length > 0 ? { teamId: { in: teamIds } } : undefined,
                trainingGroupIds.length > 0 ? { trainingGroupId: { in: trainingGroupIds } } : undefined,
            ].filter((c) => !!c),
        };
    }
    async listBirthdays(withinDays) {
        const academyId = this.tenantContext.getAcademyId();
        const players = await this.prisma.player.findMany({
            where: { academyId, status: 'ACTIVE', deletedAt: null },
            select: { id: true, firstName: true, lastName: true, playerCode: true, dateOfBirth: true },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const withDaysUntil = players.map((player) => {
            const dob = player.dateOfBirth;
            let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
            if (nextBirthday < today) {
                nextBirthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
            }
            const daysUntil = Math.round((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return { ...player, daysUntil };
        });
        return withDaysUntil
            .filter((p) => p.daysUntil <= withinDays)
            .sort((a, b) => a.daysUntil - b.daysUntil);
    }
    async findOne(id) {
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirst({
            where: { id, academyId, deletedAt: null },
            include: PROFILE_INCLUDE,
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        return player;
    }
    async create(dto) {
        const academyId = this.tenantContext.getAcademyId();
        const primaryGuardians = dto.guardians.filter((g) => g.isPrimary);
        if (primaryGuardians.length > 1) {
            throw new common_1.BadRequestException('Only one guardian can be marked as primary');
        }
        const player = await this.prisma.player.create({
            data: {
                academyId,
                firstName: dto.firstName,
                middleName: dto.middleName,
                lastName: dto.lastName,
                dateOfBirth: new Date(dto.dateOfBirth),
                gender: dto.gender,
                nationality: dto.nationality,
                residentialAddress: dto.residentialAddress,
                medicalNotes: dto.medicalNotes,
                previousExperience: dto.previousExperience,
                preferredPosition: dto.preferredPosition,
                dominantFoot: dto.dominantFoot,
                emergencyContactName: dto.emergencyContactName,
                emergencyContactPhone: dto.emergencyContactPhone,
                ageCategoryId: dto.ageCategoryId,
                status: 'DRAFT',
                guardians: {
                    create: dto.guardians.map((g) => ({
                        academyId,
                        relationship: g.relationship,
                        isPrimary: g.isPrimary ?? false,
                        guardian: {
                            create: {
                                academyId,
                                firstName: g.firstName,
                                lastName: g.lastName,
                                phone: g.phone,
                                email: g.email,
                                address: g.address,
                            },
                        },
                    })),
                },
                registrations: { create: { academyId, status: 'DRAFT' } },
            },
            include: PROFILE_INCLUDE,
        });
        return player;
    }
    async update(id, dto) {
        const player = await this.findOne(id);
        if ((dto.teamId !== undefined || dto.trainingGroupId !== undefined) && player.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Team assignment requires the registration payment to be collected first');
        }
        return this.prisma.player.update({
            where: { id, academyId: player.academyId },
            data: {
                ...dto,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            },
            include: PROFILE_INCLUDE,
        });
    }
    async updateTeamAssignment(id, dto) {
        const player = await this.findOne(id);
        const isAssigning = (dto.teamId !== undefined && dto.teamId !== null)
            || (dto.trainingGroupId !== undefined && dto.trainingGroupId !== null);
        if (isAssigning && player.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Team assignment requires the registration payment to be collected first');
        }
        return this.prisma.player.update({
            where: { id, academyId: player.academyId },
            data: {
                teamId: dto.teamId,
                trainingGroupId: dto.trainingGroupId,
            },
            include: PROFILE_INCLUDE,
        });
    }
    async updateStatus(id, status) {
        const player = await this.findOne(id);
        if (!['ACTIVE', 'SUSPENDED', 'WITHDRAWN'].includes(player.status)) {
            throw new common_1.BadRequestException('Only a fully registered player can be suspended, withdrawn, or reinstated');
        }
        return this.prisma.player.update({
            where: { id, academyId: player.academyId },
            data: { status },
            include: PROFILE_INCLUDE,
        });
    }
    async addGuardian(playerId, dto) {
        const academyId = this.tenantContext.getAcademyId();
        await this.findOne(playerId);
        if (dto.isPrimary) {
            await this.prisma.playerGuardian.updateMany({
                where: { playerId, academyId },
                data: { isPrimary: false },
            });
        }
        const guardian = await this.prisma.guardian.create({
            data: {
                academyId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                email: dto.email,
                address: dto.address,
            },
        });
        await this.prisma.playerGuardian.create({
            data: {
                academyId,
                playerId,
                guardianId: guardian.id,
                relationship: dto.relationship,
                isPrimary: dto.isPrimary ?? false,
            },
        });
        return this.findOne(playerId);
    }
    async submit(id) {
        const player = await this.findOne(id);
        if (player.status !== 'DRAFT' && player.status !== 'PENDING_PARENT_INFO') {
            throw new common_1.BadRequestException(`Cannot submit a player in status ${player.status}`);
        }
        const registration = player.registrations[0];
        await this.prisma.$transaction([
            this.prisma.player.update({ where: { id, academyId: player.academyId }, data: { status: 'SUBMITTED' } }),
            this.prisma.playerRegistration.update({
                where: { id: registration.id },
                data: { status: 'SUBMITTED', submittedAt: new Date() },
            }),
        ]);
        return this.findOne(id);
    }
    async approve(id, reviewerUserId, dto = {}) {
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.findOne(id);
        const existingInvoiceId = player.registrations[0]?.registrationFeeInvoiceId;
        const hasValidInvoice = existingInvoiceId
            ? await this.prisma.invoice.findFirst({ where: { id: existingInvoiceId, academyId } })
            : null;
        const canProceed = ['DRAFT', 'PENDING_PARENT_INFO', 'SUBMITTED'].includes(player.status) ||
            (player.status === 'PENDING_REGISTRATION_PAYMENT' && !hasValidInvoice);
        if (!canProceed) {
            throw new common_1.BadRequestException(`Cannot proceed to payment for a player in status ${player.status}`);
        }
        if (!player.ageCategoryId) {
            throw new common_1.BadRequestException('Assign an age category before proceeding to payment');
        }
        const registrationFeeType = await this.prisma.feeType.findFirst({
            where: { academyId, isRegistrationFee: true, isActive: true },
            include: { items: { include: { feeItem: true } } },
        });
        if (!registrationFeeType) {
            throw new common_1.BadRequestException('No active registration fee is configured. Ask an administrator to set one up.');
        }
        let amount = registrationFeeType.defaultAmount;
        let itemsCharged = registrationFeeType.items;
        if (dto.feeItemIds !== undefined) {
            const selected = new Set(dto.feeItemIds);
            itemsCharged = registrationFeeType.items.filter((link) => selected.has(link.feeItemId));
            amount = itemsCharged.reduce((sum, link) => sum + Number(link.amount), 0);
        }
        const itemsSummary = itemsCharged.map((link) => link.feeItem.name).join(', ');
        const registration = player.registrations[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        const invoice = await this.prisma.invoice.create({
            data: {
                academyId,
                invoiceNumber: (0, finance_utils_1.generateInvoiceNumber)(),
                playerId: player.id,
                feeTypeId: registrationFeeType.id,
                description: itemsSummary
                    ? `Registration fee — ${player.firstName} ${player.lastName} (${itemsSummary})`
                    : `Registration fee — ${player.firstName} ${player.lastName}`,
                amount,
                dueDate,
                gracePeriodDays: 7,
                status: 'PENDING',
            },
        });
        await this.prisma.$transaction([
            this.prisma.player.update({ where: { id, academyId }, data: { status: 'PENDING_REGISTRATION_PAYMENT' } }),
            this.prisma.playerRegistration.update({
                where: { id: registration.id },
                data: {
                    status: 'PENDING_REGISTRATION_PAYMENT',
                    reviewedByUserId: reviewerUserId,
                    reviewedAt: new Date(),
                    registrationFeeInvoiceId: invoice.id,
                },
            }),
        ]);
        return this.findOne(id);
    }
    async confirmPayment(id, receptionistUserId, dto) {
        const { player, registration, invoice } = await this.getPendingRegistrationInvoice(id);
        const academyId = player.academyId;
        const payment = await this.prisma.payment.create({
            data: {
                academyId,
                receiptNumber: (0, finance_utils_1.generateReceiptNumber)(),
                playerId: player.id,
                amount: invoice.amount,
                method: dto.method,
                reference: dto.reference,
                receivedByUserId: receptionistUserId,
                allocations: {
                    create: { academyId, invoiceId: invoice.id, amount: invoice.amount },
                },
            },
        });
        const playerCode = await this.generateUniquePlayerCode(player.ageCategoryId, player.dateOfBirth);
        await this.prisma.$transaction([
            this.prisma.invoice.update({ where: { id: invoice.id, academyId }, data: { status: 'PAID' } }),
            this.prisma.player.update({
                where: { id, academyId },
                data: { status: 'ACTIVE', playerCode },
            }),
            this.prisma.playerRegistration.update({
                where: { id: registration.id },
                data: { status: 'ACTIVE' },
            }),
        ]);
        await this.receipts.sendPaymentReceipt(payment.id);
        return { player: await this.findOne(id), payment };
    }
    async activateAfterRegistrationPayment(playerId) {
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirst({
            where: { id: playerId, academyId },
            include: { registrations: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        if (!player || player.status !== 'PENDING_REGISTRATION_PAYMENT')
            return;
        const registration = player.registrations[0];
        if (!registration?.registrationFeeInvoiceId)
            return;
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: registration.registrationFeeInvoiceId, academyId },
        });
        if (!invoice || invoice.status !== 'PAID')
            return;
        const playerCode = await this.generateUniquePlayerCode(player.ageCategoryId, player.dateOfBirth);
        await this.prisma.$transaction([
            this.prisma.player.update({ where: { id: playerId, academyId }, data: { status: 'ACTIVE', playerCode } }),
            this.prisma.playerRegistration.update({ where: { id: registration.id }, data: { status: 'ACTIVE' } }),
        ]);
    }
    async getPendingRegistrationInvoice(id) {
        const player = await this.findOne(id);
        if (player.status !== 'PENDING_REGISTRATION_PAYMENT') {
            throw new common_1.BadRequestException(`Cannot collect payment for a player in status ${player.status}`);
        }
        const registration = player.registrations[0];
        if (!registration.registrationFeeInvoiceId) {
            throw new common_1.BadRequestException('No registration invoice found for this player');
        }
        const invoice = await this.prisma.invoice.findFirstOrThrow({
            where: { id: registration.registrationFeeInvoiceId, academyId: player.academyId },
            include: { feeType: { include: { items: { include: { feeItem: true } } } } },
        });
        return { player, registration, invoice };
    }
    async initiatePaystackRegistrationCharge(id, dto) {
        const { player, invoice } = await this.getPendingRegistrationInvoice(id);
        const primaryGuardianLink = player.guardians.find((g) => g.isPrimary) ?? player.guardians[0];
        const email = primaryGuardianLink?.guardian.email || `player-${player.id}@noreply.invalid`;
        const reference = `REGPAY-${Date.now()}-${player.id.slice(0, 8)}`;
        return this.paystack.chargeMobileMoney({
            email,
            amount: Number(invoice.amount),
            phone: dto.phone,
            provider: dto.provider,
            reference,
        });
    }
    async verifyPaystackRegistrationCharge(id, reference, receptionistUserId) {
        await this.getPendingRegistrationInvoice(id);
        const verification = await this.paystack.verifyTransaction(reference);
        if (verification.status !== 'success') {
            return { confirmed: false, status: verification.status };
        }
        const result = await this.confirmPayment(id, receptionistUserId, {
            method: 'MOBILE_MONEY',
            reference,
        });
        return { confirmed: true, status: verification.status, ...result };
    }
    async generateUniquePlayerCode(ageCategoryId, dateOfBirth) {
        const academyId = this.tenantContext.getAcademyId();
        const ageCategory = await this.prisma.ageCategory.findFirstOrThrow({ where: { id: ageCategoryId, academyId } });
        for (let attempt = 0; attempt < 5; attempt++) {
            const candidate = await this.playerIdService.generate(ageCategory.code, dateOfBirth);
            const exists = await this.prisma.player.findFirst({ where: { playerCode: candidate, academyId } });
            if (!exists)
                return candidate;
        }
        throw new common_1.ConflictException('Could not generate a unique player ID, please retry');
    }
    async uploadPhoto(id, file, uploadedByUserId) {
        if (!ALLOWED_PHOTO_TYPES.has(file.mimetype)) {
            throw new common_1.BadRequestException('Photo must be a JPEG, PNG, or WEBP image');
        }
        if (file.size > MAX_PHOTO_BYTES) {
            throw new common_1.BadRequestException('Photo must be smaller than 5MB');
        }
        const player = await this.findOne(id);
        const academyId = player.academyId;
        const stored = await this.storage.save(file.originalname, file.mimetype, file.buffer);
        const document = await this.prisma.document.create({
            data: {
                academyId,
                ownerType: client_1.DocumentOwnerType.PLAYER,
                ownerId: player.id,
                documentType: client_1.DocumentType.PHOTO,
                fileName: stored.fileName,
                storageKey: stored.storageKey,
                mimeType: stored.mimeType,
                sizeBytes: stored.sizeBytes,
                uploadedByUserId,
            },
        });
        const previousDocumentId = player.photoDocumentId;
        await this.prisma.player.update({ where: { id, academyId }, data: { photoDocumentId: document.id } });
        if (previousDocumentId) {
            const previous = await this.prisma.document.findFirst({ where: { id: previousDocumentId, academyId } });
            if (previous) {
                await this.storage.delete(previous.storageKey).catch(() => undefined);
                await this.prisma.document.delete({ where: { id: previousDocumentId } }).catch(() => undefined);
            }
        }
        return this.findOne(id);
    }
    async getPhoto(id) {
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirst({
            where: { id, academyId, deletedAt: null },
            include: { photo: true },
        });
        if (!player?.photo) {
            throw new common_1.NotFoundException('This player has no photo');
        }
        const buffer = await this.storage.read(player.photo.storageKey);
        return { buffer, mimeType: player.photo.mimeType };
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        player_id_service_1.PlayerIdService,
        paystack_service_1.PaystackService,
        receipts_service_1.ReceiptsService,
        coach_context_service_1.CoachContextService,
        tenant_context_service_1.TenantContextService])
], PlayersService);
//# sourceMappingURL=players.service.js.map