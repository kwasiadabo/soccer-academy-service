import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE_NAMES } from '../rbac/permissions.constants';
import { RequestUser } from '../auth/types';

@Injectable()
export class CoachContextService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveCoachId(userId: string): Promise<string> {
    const coach = await this.prisma.coach.findFirst({ where: { userId, deletedAt: null } });
    if (!coach) {
      throw new ForbiddenException('No coach profile is linked to this account');
    }
    return coach.id;
  }

  async assertOwnsTeam(coachId: string, teamId: string): Promise<void> {
    const assignment = await this.prisma.coachAssignment.findFirst({
      where: { coachId, teamId, effectiveTo: null },
    });
    if (!assignment) {
      throw new ForbiddenException('You are not assigned to this team');
    }
  }

  async assertOwnsTrainingGroup(coachId: string, trainingGroupId: string): Promise<void> {
    const assignment = await this.prisma.coachAssignment.findFirst({
      where: { coachId, trainingGroupId, effectiveTo: null },
    });
    if (!assignment) {
      throw new ForbiddenException('You are not assigned to this training group');
    }
  }

  async getAssignedTeamIds(coachId: string): Promise<string[]> {
    const assignments = await this.prisma.coachAssignment.findMany({
      where: { coachId, effectiveTo: null, teamId: { not: null } },
      select: { teamId: true },
    });
    return assignments.map((a) => a.teamId!);
  }

  async getAssignedTrainingGroupIds(coachId: string): Promise<string[]> {
    const assignments = await this.prisma.coachAssignment.findMany({
      where: { coachId, effectiveTo: null, trainingGroupId: { not: null } },
      select: { trainingGroupId: true },
    });
    return assignments.map((a) => a.trainingGroupId!);
  }

  // A caller is "coach-only" when their sole relevant role is Coach — Head Coach and Admin
  // oversee every team/group and must never be scoped down to a single coach's roster.
  isCoachOnly(user: RequestUser): boolean {
    return (
      user.roles.includes(ROLE_NAMES.COACH) &&
      !user.roles.includes(ROLE_NAMES.HEAD_COACH) &&
      !user.roles.includes(ROLE_NAMES.ADMIN)
    );
  }

  // Shared by every "does this coach own X" check below — succeeds if the coach is
  // assigned (by an active CoachAssignment) to either the team or the training group.
  private async assertOwnsTeamOrGroup(
    coachId: string,
    entity: { teamId: string | null; trainingGroupId: string | null },
    notOwnedMessage: string,
  ): Promise<void> {
    const assignment = await this.prisma.coachAssignment.findFirst({
      where: {
        coachId,
        effectiveTo: null,
        OR: [
          entity.teamId ? { teamId: entity.teamId } : undefined,
          entity.trainingGroupId ? { trainingGroupId: entity.trainingGroupId } : undefined,
        ].filter((c): c is NonNullable<typeof c> => !!c),
      },
    });
    if (!assignment) {
      throw new ForbiddenException(notOwnedMessage);
    }
  }

  async assertOwnsPlayer(
    coachId: string,
    player: { teamId: string | null; trainingGroupId: string | null },
  ): Promise<void> {
    await this.assertOwnsTeamOrGroup(coachId, player, 'This player is not on one of your assigned teams or training groups');
  }

  async assertOwnsSession(
    coachId: string,
    session: { teamId: string; trainingGroupId: string | null },
  ): Promise<void> {
    await this.assertOwnsTeamOrGroup(coachId, session, 'You do not have access to this training session');
  }

  // Used to gate RATING a session's players specifically (as opposed to logistics like
  // attendance/activities, which any Head Coach/Admin can manage). A coach may rate a
  // session's players if they're assigned to its team/group, or if they personally
  // conducted it — the latter is what lets a Head Coach (who usually has no team
  // assignment of their own) rate players for a session they stepped in to run.
  async assertOwnsOrConductedSession(
    coachId: string,
    session: { teamId: string; trainingGroupId: string | null; conductedByCoachId: string | null },
  ): Promise<void> {
    if (session.conductedByCoachId === coachId) return;
    await this.assertOwnsTeamOrGroup(coachId, session, 'You were not in charge of this training session');
  }

  async assertOwnsPlan(
    coachId: string,
    plan: { teamId: string; trainingGroupId: string | null },
  ): Promise<void> {
    await this.assertOwnsTeamOrGroup(coachId, plan, 'You do not have access to this training plan');
  }
}
