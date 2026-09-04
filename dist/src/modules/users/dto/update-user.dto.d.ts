declare const USER_STATUSES: readonly ["ACTIVE", "INACTIVE", "SUSPENDED"];
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status?: (typeof USER_STATUSES)[number];
    roleNames?: string[];
}
export {};
