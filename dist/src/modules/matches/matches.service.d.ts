import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { RequestUser } from '../auth/types';
import { CreateOpponentDto } from './dto/opponent.dto';
import { CreateMatchDto, UpdateMatchDto } from './dto/match.dto';
import { SetParticipationsDto } from './dto/match-participation.dto';
import { CreateMatchPlayerAssessmentDto } from './dto/match-player-assessment.dto';
export declare class MatchesService {
    private readonly prisma;
    private readonly coachContext;
    constructor(prisma: PrismaService, coachContext: CoachContextService);
    private isUnscoped;
    private assertCanManageTeam;
    private assertCanRateMatch;
    listOpponents(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        contactInfo: string | null;
    }[]>;
    createOpponent(dto: CreateOpponentDto): Prisma.Prisma__OpponentClient<{
        id: string;
        createdAt: Date;
        name: string;
        contactInfo: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private getMatchOrThrow;
    findAll(user: RequestUser): Promise<({
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            remarks: string | null;
            playerId: string;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
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
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            remarks: string | null;
            playerId: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
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
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            remarks: string | null;
            playerId: string;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
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
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            remarks: string | null;
            playerId: string;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
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
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            remarks: string | null;
            playerId: string;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
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
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            createdAt: Date;
            name: string;
            contactInfo: string | null;
        };
        participations: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            remarks: string | null;
            playerId: string;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MatchStatus;
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
