import { MatchStatus } from '@prisma/client';
export declare class CreateMatchDto {
    teamId: string;
    opponentId: string;
    competitionName?: string;
    venue?: string;
    matchDate: string;
}
export declare class UpdateMatchDto {
    status?: MatchStatus;
    homeScore?: number;
    awayScore?: number;
    notes?: string;
    venue?: string;
    matchDate?: string;
}
