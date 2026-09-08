import { OrderItemInputDto } from './create-order.dto';
export declare class CreateGuestOrderDto {
    playerCode: string;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    items: OrderItemInputDto[];
}
