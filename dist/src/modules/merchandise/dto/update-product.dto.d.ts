import { ProductCategory } from '@prisma/client';
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    category?: ProductCategory;
    basePrice?: number;
    isActive?: boolean;
}
