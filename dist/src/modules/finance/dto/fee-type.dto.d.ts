import { FeeCategory } from '@prisma/client';
export declare class CreateFeeTypeDto {
    name: string;
    category: FeeCategory;
    description?: string;
    isRecurring?: boolean;
}
export declare class UpdateFeeTypeDto {
    name?: string;
    description?: string;
    isRecurring?: boolean;
    isActive?: boolean;
}
export declare class AddFeeTypeItemDto {
    feeItemId: string;
}
