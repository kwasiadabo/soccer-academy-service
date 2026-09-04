import { RequestUser } from '../auth/types';
import { MatchesService } from './matches.service';
import { CreateOpponentDto } from './dto/opponent.dto';
import { CreateMatchDto, UpdateMatchDto } from './dto/match.dto';
import { SetParticipationsDto } from './dto/match-participation.dto';
import { CreateMatchPlayerAssessmentDto } from './dto/match-player-assessment.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    listOpponents(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        contactInfo: string | null;
    }[]>;
    createOpponent(dto: CreateOpponentDto): import(".prisma/client").Prisma.Prisma__OpponentClient<{
        id: string;
        createdAt: Date;
        name: string;
        contactInfo: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
            technicalRating: import("@prisma/client/runtime/library").Decimal | null;
            tacticalRating: import("@prisma/client/runtime/library").Decimal | null;
            teamContributionRating: import("@prisma/client/runtime/library").Decimal | null;
            disciplineRating: import("@prisma/client/runtime/library").Decimal | null;
            effortRating: import("@prisma/client/runtime/library").Decimal | null;
            overallRating: import("@prisma/client/runtime/library").Decimal | null;
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
            technicalRating: import("@prisma/client/runtime/library").Decimal | null;
            tacticalRating: import("@prisma/client/runtime/library").Decimal | null;
            teamContributionRating: import("@prisma/client/runtime/library").Decimal | null;
            disciplineRating: import("@prisma/client/runtime/library").Decimal | null;
            effortRating: import("@prisma/client/runtime/library").Decimal | null;
            overallRating: import("@prisma/client/runtime/library").Decimal | null;
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
    create(dto: CreateMatchDto, user: RequestUser): Promise<{
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
            technicalRating: import("@prisma/client/runtime/library").Decimal | null;
            tacticalRating: import("@prisma/client/runtime/library").Decimal | null;
            teamContributionRating: import("@prisma/client/runtime/library").Decimal | null;
            disciplineRating: import("@prisma/client/runtime/library").Decimal | null;
            effortRating: import("@prisma/client/runtime/library").Decimal | null;
            overallRating: import("@prisma/client/runtime/library").Decimal | null;
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
    update(id: string, dto: UpdateMatchDto, user: RequestUser): Promise<{
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
            technicalRating: import("@prisma/client/runtime/library").Decimal | null;
            tacticalRating: import("@prisma/client/runtime/library").Decimal | null;
            teamContributionRating: import("@prisma/client/runtime/library").Decimal | null;
            disciplineRating: import("@prisma/client/runtime/library").Decimal | null;
            effortRating: import("@prisma/client/runtime/library").Decimal | null;
            overallRating: import("@prisma/client/runtime/library").Decimal | null;
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
    setParticipations(id: string, dto: SetParticipationsDto, user: RequestUser): Promise<{
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
            technicalRating: import("@prisma/client/runtime/library").Decimal | null;
            tacticalRating: import("@prisma/client/runtime/library").Decimal | null;
            teamContributionRating: import("@prisma/client/runtime/library").Decimal | null;
            disciplineRating: import("@prisma/client/runtime/library").Decimal | null;
            effortRating: import("@prisma/client/runtime/library").Decimal | null;
            overallRating: import("@prisma/client/runtime/library").Decimal | null;
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
    addPlayerAssessment(id: string, dto: CreateMatchPlayerAssessmentDto, user: RequestUser): Promise<{
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
            technicalRating: import("@prisma/client/runtime/library").Decimal | null;
            tacticalRating: import("@prisma/client/runtime/library").Decimal | null;
            teamContributionRating: import("@prisma/client/runtime/library").Decimal | null;
            disciplineRating: import("@prisma/client/runtime/library").Decimal | null;
            effortRating: import("@prisma/client/runtime/library").Decimal | null;
            overallRating: import("@prisma/client/runtime/library").Decimal | null;
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
