export declare class OrderItemInputDto {
    productVariantId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    playerId: string;
    items: OrderItemInputDto[];
}
