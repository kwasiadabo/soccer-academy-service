import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { RequestUser } from '../auth/types';
import { CreateOpponentDto } from './dto/opponent.dto';
import { CreateMatchDto, UpdateMatchDto } from './dto/match.dto';
import { SetParticipationsDto } from './dto/match-participation.dto';
import { CreateMatchPlayerAssessmentDto } from './dto/match-player-assessment.dto';
export declare class MatchesService {
    private readonly prisma;
    private readonly coachContext;
    private readonly tenantContext;
    constructor(prisma: PrismaService, coachContext: CoachContextService, tenantContext: TenantContextService);
    private isUnscoped;
    private assertCanManageTeam;
    private assertCanRateMatch;
    listOpponents(): Prisma.PrismaPromise<{
        id: string;
        academyId: string;
        createdAt: Date;
        name: string;
        contactInfo: string | null;
    }[]>;
    createOpponent(dto: CreateOpponentDto): Prisma.Prisma__OpponentClient<{
        id: string;
        academyId: string;
        createdAt: Date;
        name: string;
        contactInfo: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private getMatchOrThrow;
    findAll(user: RequestUser): Promise<({
        team: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            academyId: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        matchPlayerAssessments: {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            remarks: string | null;
            matchId: string;
            assessedByCoachId: string;
            technicalRating: Prisma.Decimal | null;
            tacticalRating: Prisma.Decimal | null;
            teamContributionRating: Prisma.Decimal | null;
            disciplineRating: Prisma.Decimal | null;
            effortRating: Prisma.Decimal | null;
            overallRating: Prisma.Decimal | null;
            recommendations: string | null;
        }[];
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            academyId: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        opponentId: string;
        competitionName: string | null;
        venue: string | null;
        matchDate: Date;
        homeScore: number | null;
        awayScore: number | null;
        notes: string | null;
    })[]>;
    findOne(id: string, user: RequestUser): Promise<{
        roster: {
            id: string;
            firstName: string;
            lastName: string;
        }[];
        team: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            academyId: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        matchPlayerAssessments: {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            remarks: string | null;
            matchId: string;
            assessedByCoachId: string;
            technicalRating: Prisma.Decimal | null;
            tacticalRating: Prisma.Decimal | null;
            teamContributionRating: Prisma.Decimal | null;
            disciplineRating: Prisma.Decimal | null;
            effortRating: Prisma.Decimal | null;
            overallRating: Prisma.Decimal | null;
            recommendations: string | null;
        }[];
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            academyId: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        opponentId: string;
        competitionName: string | null;
        venue: string | null;
        matchDate: Date;
        homeScore: number | null;
        awayScore: number | null;
        notes: string | null;
    }>;
    create(user: RequestUser, dto: CreateMatchDto): Promise<{
        team: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            academyId: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        matchPlayerAssessments: {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            remarks: string | null;
            matchId: string;
            assessedByCoachId: string;
            technicalRating: Prisma.Decimal | null;
            tacticalRating: Prisma.Decimal | null;
            teamContributionRating: Prisma.Decimal | null;
            disciplineRating: Prisma.Decimal | null;
            effortRating: Prisma.Decimal | null;
            overallRating: Prisma.Decimal | null;
            recommendations: string | null;
        }[];
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            academyId: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        opponentId: string;
        competitionName: string | null;
        venue: string | null;
        matchDate: Date;
        homeScore: number | null;
        awayScore: number | null;
        notes: string | null;
    }>;
    update(id: string, user: RequestUser, dto: UpdateMatchDto): Promise<{
        team: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            academyId: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        matchPlayerAssessments: {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            remarks: string | null;
            matchId: string;
            assessedByCoachId: string;
            technicalRating: Prisma.Decimal | null;
            tacticalRating: Prisma.Decimal | null;
            teamContributionRating: Prisma.Decimal | null;
            disciplineRating: Prisma.Decimal | null;
            effortRating: Prisma.Decimal | null;
            overallRating: Prisma.Decimal | null;
            recommendations: string | null;
        }[];
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            academyId: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        opponentId: string;
        competitionName: string | null;
        venue: string | null;
        matchDate: Date;
        homeScore: number | null;
        awayScore: number | null;
        notes: string | null;
    }>;
    private assertPlayersAreActive;
    setParticipations(id: string, user: RequestUser, dto: SetParticipationsDto): Promise<{
        team: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            academyId: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        matchPlayerAssessments: {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            remarks: string | null;
            matchId: string;
            assessedByCoachId: string;
            technicalRating: Prisma.Decimal | null;
            tacticalRating: Prisma.Decimal | null;
            teamContributionRating: Prisma.Decimal | null;
            disciplineRating: Prisma.Decimal | null;
            effortRating: Prisma.Decimal | null;
            overallRating: Prisma.Decimal | null;
            recommendations: string | null;
        }[];
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            academyId: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        opponentId: string;
        competitionName: string | null;
        venue: string | null;
        matchDate: Date;
        homeScore: number | null;
        awayScore: number | null;
        notes: string | null;
    }>;
    addPlayerAssessment(id: string, user: RequestUser, dto: CreateMatchPlayerAssessmentDto): Promise<{
        team: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            academyId: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        matchPlayerAssessments: {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            remarks: string | null;
            matchId: string;
            assessedByCoachId: string;
            technicalRating: Prisma.Decimal | null;
            tacticalRating: Prisma.Decimal | null;
            teamContributionRating: Prisma.Decimal | null;
            disciplineRating: Prisma.Decimal | null;
            effortRating: Prisma.Decimal | null;
            overallRating: Prisma.Decimal | null;
            recommendations: string | null;
        }[];
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            academyId: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        opponentId: string;
        competitionName: string | null;
        venue: string | null;
        matchDate: Date;
        homeScore: number | null;
        awayScore: number | null;
        notes: string | null;
    }>;
}
