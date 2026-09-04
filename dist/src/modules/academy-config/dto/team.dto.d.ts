export declare class CreateTeamDto {
    name: string;
    ageCategoryId: string;
    seasonId: string;
    headCoachId?: string;
}
export declare class UpdateTeamDto {
    name?: string;
    headCoachId?: string;
    isActive?: boolean;
}
