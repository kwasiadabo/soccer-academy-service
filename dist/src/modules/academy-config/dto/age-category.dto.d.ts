export declare class CreateAgeCategoryDto {
    name: string;
    code: string;
    minAge: number;
    maxAge: number;
    sortOrder?: number;
}
export declare class UpdateAgeCategoryDto {
    name?: string;
    minAge?: number;
    maxAge?: number;
    sortOrder?: number;
    isActive?: boolean;
}
