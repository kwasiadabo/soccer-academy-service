import { PrismaService } from '../prisma/prisma.service';
import { RequestUser } from '../auth/types';
export declare class CoachContextService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveCoachId(userId: string): Promise<string>;
    assertOwnsTeam(coachId: string, teamId: string): Promise<void>;
    assertOwnsTrainingGroup(coachId: string, trainingGroupId: string): Promise<void>;
    getAssignedTeamIds(coachId: string): Promise<string[]>;
    getAssignedTrainingGroupIds(coachId: string): Promise<string[]>;
    isCoachOnly(user: RequestUser): boolean;
    private assertOwnsTeamOrGroup;
    assertOwnsPlayer(coachId: string, player: {
        teamId: string | null;
        trainingGroupId: string | null;
    }): Promise<void>;
    assertOwnsSession(coachId: string, session: {
        teamId: string;
        trainingGroupId: string | null;
    }): Promise<void>;
    assertOwnsOrConductedSession(coachId: string, session: {
        teamId: string;
        trainingGroupId: string | null;
        conductedByCoachId: string | null;
    }): Promise<void>;
    assertOwnsPlan(coachId: string, plan: {
        teamId: string;
        trainingGroupId: string | null;
    }): Promise<void>;
}
