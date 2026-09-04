import { MerchandiseOrderStatus } from '@prisma/client';
export declare class UpdateOrderStatusDto {
    status: MerchandiseOrderStatus;
    staffNotes?: string;
}
