export declare class CreateFeeTypeDto {
    name: string;
    description?: string;
    isRecurring?: boolean;
    isRegistrationFee?: boolean;
}
export declare class UpdateFeeTypeDto {
    name?: string;
    description?: string;
    isRecurring?: boolean;
    isActive?: boolean;
}
export declare class AddFeeTypeItemDto {
    feeItemId: string;
    amount: number;
}
