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
        name: string;
        createdAt: Date;
        academyId: string;
        contactInfo: string | null;
    }[]>;
    createOpponent(dto: CreateOpponentDto): import(".prisma/client").Prisma.Prisma__OpponentClient<{
        id: string;
        name: string;
        createdAt: Date;
        academyId: string;
        contactInfo: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(user: RequestUser): Promise<({
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            remarks: string | null;
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
        team: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
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
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            remarks: string | null;
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
        team: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
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
            academyId: string;
            playerId: string;
            matchId: string;
            isStarting: boolean;
            isSubstitute: boolean;
            positionPlayed: string | null;
            minutesPlayed: number | null;
        })[];
        id: string;
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            remarks: string | null;
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
        team: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
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
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            remarks: string | null;
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
        team: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
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
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            remarks: string | null;
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
        team: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
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
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
        matchPlayerAssessments: {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            remarks: string | null;
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
        team: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        opponent: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
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
        status: import(".prisma/client").$Enums.MatchStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
