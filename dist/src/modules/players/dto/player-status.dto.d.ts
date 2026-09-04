import { PlayerStatus } from '@prisma/client';
export declare class UpdatePlayerStatusDto {
    status: Extract<PlayerStatus, 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'>;
}
