export declare class ParticipationInputDto {
    playerId: string;
    isStarting?: boolean;
    isSubstitute?: boolean;
    positionPlayed?: string;
    minutesPlayed?: number;
}
export declare class SetParticipationsDto {
    records: ParticipationInputDto[];
}
