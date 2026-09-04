import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

// Rolls a date back to the Saturday of its week (today, if it's already Saturday).
// Mirrors TrainingService#resolveSaturday — kept as a small local copy since it's a
// pure 5-line date calculation, not worth a shared module for two call sites.
function resolveSaturday(): Date {
  const base = new Date();
  const day = base.getUTCDay(); // 0 = Sunday .. 6 = Saturday
  const daysSinceSaturday = (day + 1) % 7;
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() - daysSinceSaturday));
}

@Injectable()
export class PlayerOfTheWeekService {
  private readonly logger = new Logger(PlayerOfTheWeekService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  // Runs every Saturday at 11:00 — after the 08:00-10:00 session has wrapped and coaches
  // have had a chance to enter that session's activity marks — and picks, per active team,
  // whichever player has the highest average rating across this week's training plan
  // activities. One award per team per Saturday session (unique on trainingSessionId).
  @Cron('0 11 * * 6')
  async handleWeeklyComputationCron() {
    const result = await this.computeForAllTeams();
    this.logger.log(
      `Player of the Week: picked ${result.picked}, skipped ${result.skipped} (no session/marks/already picked).`,
    );
  }

  async computeForAllTeams(): Promise<{ picked: number; skipped: number }> {
    const weekOf = resolveSaturday();
    const teams = await this.prisma.team.findMany({ where: { isActive: true }, select: { id: true } });

    let picked = 0;
    let skipped = 0;

    for (const team of teams) {
      const session = await this.prisma.trainingSession.findFirst({ where: { teamId: team.id, date: weekOf } });
      if (!session) {
        skipped++;
        continue;
      }

      const existingAward = await this.prisma.playerOfTheWeek.findUnique({
        where: { trainingSessionId: session.id },
      });
      if (existingAward) {
        skipped++;
        continue;
      }

      const marks = await this.prisma.trainingActivityMark.findMany({
        where: { trainingActivity: { trainingPlan: { teamId: team.id, scheduledDate: weekOf } } },
        select: { playerId: true, rating: true },
      });
      if (marks.length === 0) {
        skipped++;
        continue;
      }

      const totals = new Map<string, { sum: number; count: number }>();
      for (const mark of marks) {
        const entry = totals.get(mark.playerId) ?? { sum: 0, count: 0 };
        entry.sum += mark.rating;
        entry.count += 1;
        totals.set(mark.playerId, entry);
      }

      let bestPlayerId: string | null = null;
      let bestAverage = -Infinity;
      for (const [playerId, { sum, count }] of totals) {
        const average = sum / count;
        if (average > bestAverage) {
          bestAverage = average;
          bestPlayerId = playerId;
        }
      }
      if (!bestPlayerId) {
        skipped++;
        continue;
      }

      await this.prisma.playerOfTheWeek.create({
        data: {
          playerId: bestPlayerId,
          teamId: team.id,
          trainingSessionId: session.id,
          weekOf,
          averageRating: Math.round(bestAverage * 100) / 100,
        },
      });
      picked++;
    }

    return { picked, skipped };
  }

  // Public marketing feed — most recent awards across every team, one row per player
  // per week. Only players with a photo on file are included, since the carousel is
  // image-led. Last names are reduced to an initial before this leaves the server —
  // this is a public, unauthenticated page featuring minors.
  async findPublicFeed() {
    const awards = await this.prisma.playerOfTheWeek.findMany({
      orderBy: { weekOf: 'desc' },
      take: 24,
      include: {
        player: { select: { firstName: true, lastName: true, photoDocumentId: true } },
        team: { select: { name: true } },
      },
    });

    return awards
      .filter((award) => award.player.photoDocumentId)
      .map((award) => ({
        id: award.id,
        firstName: award.player.firstName,
        lastInitial: award.player.lastName.charAt(0),
        teamName: award.team.name,
        weekOf: award.weekOf,
        averageRating: Number(award.averageRating),
        photoUrl: `/api/player-of-the-week/public/${award.id}/photo`,
      }));
  }

  async getPublicPhoto(awardId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const award = await this.prisma.playerOfTheWeek.findUnique({
      where: { id: awardId },
      include: { player: { include: { photo: true } } },
    });
    if (!award?.player.photo) {
      throw new NotFoundException('No photo available for this award');
    }
    const buffer = await this.storage.read(award.player.photo.storageKey);
    return { buffer, mimeType: award.player.photo.mimeType };
  }
}
