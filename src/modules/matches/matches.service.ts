import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { PERMISSIONS, ROLE_NAMES } from '../rbac/permissions.constants';
import { RequestUser } from '../auth/types';
import { CreateOpponentDto } from './dto/opponent.dto';
import { CreateMatchDto, UpdateMatchDto } from './dto/match.dto';
import { SetParticipationsDto } from './dto/match-participation.dto';
import { CreateMatchPlayerAssessmentDto } from './dto/match-player-assessment.dto';

const MATCH_INCLUDE = {
  team: true,
  opponent: true,
  participations: { include: { player: { select: { id: true, firstName: true, lastName: true } } } },
  matchPlayerAssessments: true,
} satisfies Prisma.MatchInclude;

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coachContext: CoachContextService,
    private readonly tenantContext: TenantContextService,
  ) {}

  // Matches have no owning coachId on the model itself (unlike TrainingPlan) —
  // any coach assigned to the team can manage its matches. Head coaches (proxied
  // by TRAINING_APPROVE, same signal used in training.service.ts) are unscoped.
  private isUnscoped(user: RequestUser): boolean {
    return user.permissions.includes(PERMISSIONS.TRAINING_APPROVE);
  }

  private async assertCanManageTeam(user: RequestUser, teamId: string): Promise<void> {
    if (this.isUnscoped(user)) return;
    const coachId = await this.coachContext.resolveCoachId(user.userId);
    await this.coachContext.assertOwnsTeam(coachId, teamId);
  }

  // RATING players is scoped tighter than general match management: a Head Coach can
  // view and administer every match (isUnscoped, above), but should only submit player
  // ratings for a match belonging to a team they're actually assigned to as a coach —
  // i.e. one they were in charge of. Only Admin remains fully unscoped here.
  private async assertCanRateMatch(user: RequestUser, teamId: string): Promise<void> {
    if (user.roles.includes(ROLE_NAMES.ADMIN)) return;
    const coachId = await this.coachContext.resolveCoachId(user.userId);
    await this.coachContext.assertOwnsTeam(coachId, teamId);
  }

  // --- Opponents ---
  listOpponents() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.opponent.findMany({ where: { academyId }, orderBy: { name: 'asc' } });
  }

  createOpponent(dto: CreateOpponentDto) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.opponent.create({ data: { ...dto, academyId } });
  }

  // --- Matches ---
  private async getMatchOrThrow(id: string) {
    const academyId = this.tenantContext.getAcademyId();
    const match = await this.prisma.match.findFirst({ where: { id, academyId }, include: MATCH_INCLUDE });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  async findAll(user: RequestUser) {
    const academyId = this.tenantContext.getAcademyId();
    if (this.isUnscoped(user)) {
      return this.prisma.match.findMany({ where: { academyId }, include: MATCH_INCLUDE, orderBy: { matchDate: 'desc' } });
    }
    const coachId = await this.coachContext.resolveCoachId(user.userId);
    const teamIds = await this.coachContext.getAssignedTeamIds(coachId);
    return this.prisma.match.findMany({
      where: { academyId, teamId: { in: teamIds } },
      include: MATCH_INCLUDE,
      orderBy: { matchDate: 'desc' },
    });
  }

  async findOne(id: string, user: RequestUser) {
    const match = await this.getMatchOrThrow(id);
    await this.assertCanManageTeam(user, match.teamId);

    const roster = await this.prisma.player.findMany({
      where: { status: 'ACTIVE', deletedAt: null, teamId: match.teamId, academyId: match.academyId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: 'asc' },
    });

    return { ...match, roster };
  }

  async create(user: RequestUser, dto: CreateMatchDto) {
    await this.assertCanManageTeam(user, dto.teamId);
    const academyId = this.tenantContext.getAcademyId();
    const { matchDate, ...rest } = dto;
    return this.prisma.match.create({
      data: { ...rest, academyId, matchDate: new Date(matchDate) },
      include: MATCH_INCLUDE,
    });
  }

  async update(id: string, user: RequestUser, dto: UpdateMatchDto) {
    const match = await this.getMatchOrThrow(id);
    await this.assertCanManageTeam(user, match.teamId);
    const { matchDate, ...rest } = dto;
    await this.prisma.match.update({
      where: { id, academyId: match.academyId },
      data: { ...rest, matchDate: matchDate ? new Date(matchDate) : undefined },
    });
    return this.getMatchOrThrow(id);
  }

  // No other player-scoped activity (squad selection, match ratings) is allowed until the
  // registration fee is paid and the player has moved to ACTIVE — mirrors the same gate
  // already enforced for training sessions/assessments.
  private async assertPlayersAreActive(academyId: string, playerIds: string[]): Promise<void> {
    if (playerIds.length === 0) return;
    const players = await this.prisma.player.findMany({
      where: { id: { in: playerIds }, academyId },
      select: { id: true, status: true },
    });
    const inactive = players.filter((p) => p.status !== 'ACTIVE');
    if (inactive.length > 0) {
      throw new BadRequestException(
        'One or more selected players cannot be added until their registration payment is complete',
      );
    }
  }

  async setParticipations(id: string, user: RequestUser, dto: SetParticipationsDto) {
    const match = await this.getMatchOrThrow(id);
    await this.assertCanManageTeam(user, match.teamId);

    // Only gate genuinely new additions to the squad — a player already in it (e.g. one
    // who has since been suspended) can still have their existing record edited.
    const existingPlayerIds = new Set(match.participations.map((p) => p.playerId));
    const newPlayerIds = dto.records.map((r) => r.playerId).filter((playerId) => !existingPlayerIds.has(playerId));
    await this.assertPlayersAreActive(match.academyId, newPlayerIds);

    await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.matchParticipation.upsert({
          where: { matchId_playerId: { matchId: id, playerId: record.playerId } },
          create: { matchId: id, academyId: match.academyId, ...record },
          update: record,
        }),
      ),
    );

    return this.getMatchOrThrow(id);
  }

  async addPlayerAssessment(id: string, user: RequestUser, dto: CreateMatchPlayerAssessmentDto) {
    const match = await this.getMatchOrThrow(id);
    await this.assertCanRateMatch(user, match.teamId);
    const coachId = await this.coachContext.resolveCoachId(user.userId);
    await this.assertPlayersAreActive(match.academyId, [dto.playerId]);

    const { playerId, ...ratings } = dto;
    await this.prisma.matchPlayerAssessment.upsert({
      where: { matchId_playerId: { matchId: id, playerId } },
      create: { matchId: id, playerId, academyId: match.academyId, assessedByCoachId: coachId, ...ratings },
      update: { assessedByCoachId: coachId, ...ratings },
    });

    return this.getMatchOrThrow(id);
  }
}
