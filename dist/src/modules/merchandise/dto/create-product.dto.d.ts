import { ProductCategory } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    description?: string;
    category: ProductCategory;
    basePrice: number;
}
