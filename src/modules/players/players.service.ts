import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentOwnerType, DocumentType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { PaystackService } from '../paystack/paystack.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { RequestUser } from '../auth/types';
import { PlayerIdService } from './player-id.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { UpdatePlayerTeamAssignmentDto } from './dto/player-team-assignment.dto';
import { AddGuardianDto } from './dto/add-guardian.dto';
import { ConfirmRegistrationPaymentDto } from './dto/confirm-payment.dto';
import { InitiatePaystackChargeDto } from './dto/paystack-charge.dto';
import { generateInvoiceNumber, generateReceiptNumber } from '../finance/finance.utils';
import { ReceiptsService } from '../receipts/receipts.service';

const PROFILE_INCLUDE = {
  ageCategory: true,
  team: true,
  trainingGroup: true,
  primaryCoach: true,
  guardians: { include: { guardian: true } },
  registrations: { orderBy: { createdAt: 'desc' as const }, take: 1 },
} satisfies Prisma.PlayerInclude;

const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

@Injectable()
export class PlayersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly playerIdService: PlayerIdService,
    private readonly paystack: PaystackService,
    private readonly receipts: ReceiptsService,
    private readonly coachContext: CoachContextService,
  ) {}

  async findAll(filter: { status?: string; search?: string; teamId?: string }, user: RequestUser) {
    const scopeFilter = await this.buildCoachScopeFilter(user);

    const players = await this.prisma.player.findMany({
      where: {
        deletedAt: null,
        status: filter.status ? (filter.status as never) : undefined,
        teamId: filter.teamId || undefined,
        // AND'd as separate clauses (rather than spread into one object) since both the
        // search match and the coach-scope check are themselves OR conditions — merging
        // them into a single `where.OR` would silently drop one of the two.
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

  // Coaches only ever see players on their own assigned team(s)/training group(s) —
  // Receptionist/Head Coach/Admin see the full roster, matching their broader responsibilities.
  private async buildCoachScopeFilter(user: RequestUser): Promise<Prisma.PlayerWhereInput> {
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
      ].filter((c): c is NonNullable<typeof c> => !!c),
    };
  }

  async listBirthdays(withinDays: number) {
    const players = await this.prisma.player.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
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

  async findOne(id: string) {
    const player = await this.prisma.player.findFirst({
      where: { id, deletedAt: null },
      include: PROFILE_INCLUDE,
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async create(dto: CreatePlayerDto) {
    const primaryGuardians = dto.guardians.filter((g) => g.isPrimary);
    if (primaryGuardians.length > 1) {
      throw new BadRequestException('Only one guardian can be marked as primary');
    }

    const player = await this.prisma.player.create({
      data: {
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
            relationship: g.relationship,
            isPrimary: g.isPrimary ?? false,
            guardian: {
              create: {
                firstName: g.firstName,
                lastName: g.lastName,
                phone: g.phone,
                email: g.email,
                address: g.address,
              },
            },
          })),
        },
        registrations: { create: { status: 'DRAFT' } },
      },
      include: PROFILE_INCLUDE,
    });

    return player;
  }

  async update(id: string, dto: UpdatePlayerDto) {
    const player = await this.findOne(id);
    if ((dto.teamId !== undefined || dto.trainingGroupId !== undefined) && player.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Team assignment requires the registration payment to be collected first',
      );
    }
    return this.prisma.player.update({
      where: { id },
      data: {
        ...dto,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
      include: PROFILE_INCLUDE,
    });
  }

  // Narrower than the general update() above — only touches team/training-group membership,
  // so it can be gated by PLAYERS_TEAM_ASSIGN instead of the full PLAYERS_MANAGE permission
  // (see MatchesService-style scoping elsewhere). Passing `null` clears the assignment;
  // omitting a field leaves it untouched — Prisma treats an explicit `null` as "clear" and an
  // `undefined` key as "don't update", so both reassigning and removing work through one call.
  async updateTeamAssignment(id: string, dto: UpdatePlayerTeamAssignmentDto) {
    const player = await this.findOne(id);
    const isAssigning = (dto.teamId !== undefined && dto.teamId !== null)
      || (dto.trainingGroupId !== undefined && dto.trainingGroupId !== null);
    if (isAssigning && player.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Team assignment requires the registration payment to be collected first',
      );
    }
    return this.prisma.player.update({
      where: { id },
      data: {
        teamId: dto.teamId,
        trainingGroupId: dto.trainingGroupId,
      },
      include: PROFILE_INCLUDE,
    });
  }

  // Suspend/withdraw/reinstate a player's registration — separate from updateTeamAssignment
  // (roster membership) and gated by the narrower PLAYERS_STATUS_MANAGE permission. Only
  // meaningful once a player has actually completed registration (ACTIVE/SUSPENDED/WITHDRAWN);
  // players still mid-registration (DRAFT, PENDING_*) go through the normal approval flow
  // instead, not this shortcut.
  async updateStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN') {
    const player = await this.findOne(id);
    if (!['ACTIVE', 'SUSPENDED', 'WITHDRAWN'].includes(player.status)) {
      throw new BadRequestException('Only a fully registered player can be suspended, withdrawn, or reinstated');
    }
    return this.prisma.player.update({
      where: { id },
      data: { status },
      include: PROFILE_INCLUDE,
    });
  }

  async addGuardian(playerId: string, dto: AddGuardianDto) {
    await this.findOne(playerId);
    if (dto.isPrimary) {
      await this.prisma.playerGuardian.updateMany({
        where: { playerId },
        data: { isPrimary: false },
      });
    }
    await this.prisma.playerGuardian.create({
      data: {
        player: { connect: { id: playerId } },
        relationship: dto.relationship,
        isPrimary: dto.isPrimary ?? false,
        guardian: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            email: dto.email,
            address: dto.address,
          },
        },
      },
    });
    return this.findOne(playerId);
  }

  async submit(id: string) {
    const player = await this.findOne(id);
    if (player.status !== 'DRAFT' && player.status !== 'PENDING_PARENT_INFO') {
      throw new BadRequestException(`Cannot submit a player in status ${player.status}`);
    }

    const registration = player.registrations[0];
    await this.prisma.$transaction([
      this.prisma.player.update({ where: { id }, data: { status: 'SUBMITTED' } }),
      this.prisma.playerRegistration.update({
        where: { id: registration.id },
        data: { status: 'SUBMITTED', submittedAt: new Date() },
      }),
    ]);

    return this.findOne(id);
  }

  // No separate review/approval gate — this moves a player straight from bio-data
  // capture to payment collection (generates the registration invoice) in one step.
  async approve(id: string, reviewerUserId: string) {
    const player = await this.findOne(id);

    // Self-heals a player stuck in PENDING_REGISTRATION_PAYMENT with no actual invoice to
    // pay (e.g. their invoice was later deleted) by letting this run again to regenerate one.
    const existingInvoiceId = player.registrations[0]?.registrationFeeInvoiceId;
    const hasValidInvoice = existingInvoiceId
      ? await this.prisma.invoice.findUnique({ where: { id: existingInvoiceId } })
      : null;
    const canProceed =
      ['DRAFT', 'PENDING_PARENT_INFO', 'SUBMITTED'].includes(player.status) ||
      (player.status === 'PENDING_REGISTRATION_PAYMENT' && !hasValidInvoice);
    if (!canProceed) {
      throw new BadRequestException(`Cannot proceed to payment for a player in status ${player.status}`);
    }
    if (!player.ageCategoryId) {
      throw new BadRequestException('Assign an age category before proceeding to payment');
    }

    // The Registration fee's amount is the sum of whatever Fee Items are attached to
    // it (see finance.service.ts#recomputeFeeTypeAmount) — jersey, kit, etc. are items
    // on this one Fee rather than separate invoices, so registration stays one invoice.
    const registrationFeeType = await this.prisma.feeType.findFirst({
      where: { category: 'REGISTRATION', isActive: true },
    });
    if (!registrationFeeType) {
      throw new BadRequestException(
        'No active registration fee is configured. Ask an administrator to set one up.',
      );
    }

    const registration = player.registrations[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        playerId: player.id,
        feeTypeId: registrationFeeType.id,
        description: `Registration fee — ${player.firstName} ${player.lastName}`,
        amount: registrationFeeType.defaultAmount,
        dueDate,
        gracePeriodDays: 7,
        status: 'PENDING',
      },
    });

    await this.prisma.$transaction([
      this.prisma.player.update({ where: { id }, data: { status: 'PENDING_REGISTRATION_PAYMENT' } }),
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

  async confirmPayment(id: string, receptionistUserId: string, dto: ConfirmRegistrationPaymentDto) {
    const { player, registration, invoice } = await this.getPendingRegistrationInvoice(id);

    const payment = await this.prisma.payment.create({
      data: {
        receiptNumber: generateReceiptNumber(),
        playerId: player.id,
        amount: invoice.amount,
        method: dto.method,
        reference: dto.reference,
        receivedByUserId: receptionistUserId,
        allocations: {
          create: { invoiceId: invoice.id, amount: invoice.amount },
        },
      },
    });

    const playerCode = await this.generateUniquePlayerCode(player.ageCategoryId!, player.dateOfBirth);

    await this.prisma.$transaction([
      this.prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'PAID' } }),
      this.prisma.player.update({
        where: { id },
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

  // Lets payment collection happen from anywhere (e.g. the generic Financial tab) while
  // keeping the ACTIVE transition + player code assignment centralized here. No-ops
  // unless the player is actually waiting on their registration invoice and it's now paid.
  async activateAfterRegistrationPayment(playerId: string) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { registrations: { orderBy: { createdAt: 'desc' as const }, take: 1 } },
    });
    if (!player || player.status !== 'PENDING_REGISTRATION_PAYMENT') return;

    const registration = player.registrations[0];
    if (!registration?.registrationFeeInvoiceId) return;

    const invoice = await this.prisma.invoice.findUnique({ where: { id: registration.registrationFeeInvoiceId } });
    if (!invoice || invoice.status !== 'PAID') return;

    const playerCode = await this.generateUniquePlayerCode(player.ageCategoryId!, player.dateOfBirth);
    await this.prisma.$transaction([
      this.prisma.player.update({ where: { id: playerId }, data: { status: 'ACTIVE', playerCode } }),
      this.prisma.playerRegistration.update({ where: { id: registration.id }, data: { status: 'ACTIVE' } }),
    ]);
  }

  private async getPendingRegistrationInvoice(id: string) {
    const player = await this.findOne(id);
    if (player.status !== 'PENDING_REGISTRATION_PAYMENT') {
      throw new BadRequestException(`Cannot collect payment for a player in status ${player.status}`);
    }
    const registration = player.registrations[0];
    if (!registration.registrationFeeInvoiceId) {
      throw new BadRequestException('No registration invoice found for this player');
    }
    const invoice = await this.prisma.invoice.findUniqueOrThrow({
      where: { id: registration.registrationFeeInvoiceId },
      include: { feeType: { include: { items: { include: { feeItem: true } } } } },
    });
    return { player, registration, invoice };
  }

  async initiatePaystackRegistrationCharge(id: string, dto: InitiatePaystackChargeDto) {
    const { player, invoice } = await this.getPendingRegistrationInvoice(id);

    const primaryGuardianLink = player.guardians.find((g) => g.isPrimary) ?? player.guardians[0];
    const email = primaryGuardianLink?.guardian.email || `player-${player.id}@kapikidsacademy.com`;
    const reference = `REGPAY-${Date.now()}-${player.id.slice(0, 8)}`;

    return this.paystack.chargeMobileMoney({
      email,
      amount: Number(invoice.amount),
      phone: dto.phone,
      provider: dto.provider,
      reference,
    });
  }

  async verifyPaystackRegistrationCharge(id: string, reference: string, receptionistUserId: string) {
    // Re-check the invoice exists / player is still awaiting payment before trusting the reference.
    await this.getPendingRegistrationInvoice(id);

    const verification = await this.paystack.verifyTransaction(reference);
    if (verification.status !== 'success') {
      return { confirmed: false as const, status: verification.status };
    }

    const result = await this.confirmPayment(id, receptionistUserId, {
      method: 'MOBILE_MONEY',
      reference,
    });
    return { confirmed: true as const, status: verification.status, ...result };
  }

  private async generateUniquePlayerCode(ageCategoryId: string, dateOfBirth: Date): Promise<string> {
    const ageCategory = await this.prisma.ageCategory.findUniqueOrThrow({ where: { id: ageCategoryId } });

    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = await this.playerIdService.generate(ageCategory.code, dateOfBirth);
      const exists = await this.prisma.player.findUnique({ where: { playerCode: candidate } });
      if (!exists) return candidate;
    }
    throw new ConflictException('Could not generate a unique player ID, please retry');
  }

  async uploadPhoto(id: string, file: Express.Multer.File, uploadedByUserId: string) {
    if (!ALLOWED_PHOTO_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Photo must be a JPEG, PNG, or WEBP image');
    }
    if (file.size > MAX_PHOTO_BYTES) {
      throw new BadRequestException('Photo must be smaller than 5MB');
    }

    const player = await this.findOne(id);
    const stored = await this.storage.save(file.originalname, file.mimetype, file.buffer);

    const document = await this.prisma.document.create({
      data: {
        ownerType: DocumentOwnerType.PLAYER,
        ownerId: player.id,
        documentType: DocumentType.PHOTO,
        fileName: stored.fileName,
        storageKey: stored.storageKey,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        uploadedByUserId,
      },
    });

    const previousDocumentId = player.photoDocumentId;
    await this.prisma.player.update({ where: { id }, data: { photoDocumentId: document.id } });

    if (previousDocumentId) {
      const previous = await this.prisma.document.findUnique({ where: { id: previousDocumentId } });
      if (previous) {
        await this.storage.delete(previous.storageKey).catch(() => undefined);
        await this.prisma.document.delete({ where: { id: previousDocumentId } }).catch(() => undefined);
      }
    }

    return this.findOne(id);
  }

  async getPhoto(id: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const player = await this.prisma.player.findFirst({
      where: { id, deletedAt: null },
      include: { photo: true },
    });
    if (!player?.photo) {
      throw new NotFoundException('This player has no photo');
    }
    const buffer = await this.storage.read(player.photo.storageKey);
    return { buffer, mimeType: player.photo.mimeType };
  }
}
