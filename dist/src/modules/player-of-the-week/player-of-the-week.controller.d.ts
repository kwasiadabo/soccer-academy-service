import { Response } from 'express';
import { PlayerOfTheWeekService } from './player-of-the-week.service';
export declare class PlayerOfTheWeekController {
    private readonly service;
    constructor(service: PlayerOfTheWeekService);
    getPublicFeed(): Promise<{
        id: string;
        firstName: string;
        lastInitial: string;
        teamName: string;
        weekOf: Date;
        averageRating: number;
        photoUrl: string;
    }[]>;
    getPublicPhoto(id: string, res: Response): Promise<void>;
}
