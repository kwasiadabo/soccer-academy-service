export declare class CreateFeeItemDto {
    name: string;
    description?: string;
    defaultAmount: number;
}
export declare class UpdateFeeItemDto {
    name?: string;
    description?: string;
    defaultAmount?: number;
    isActive?: boolean;
}
