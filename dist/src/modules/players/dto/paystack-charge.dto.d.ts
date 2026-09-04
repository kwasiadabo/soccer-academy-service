declare const MOMO_PROVIDERS: readonly ["mtn", "vod", "tgo"];
export type MomoProviderCode = (typeof MOMO_PROVIDERS)[number];
export declare class InitiatePaystackChargeDto {
    phone: string;
    provider: MomoProviderCode;
}
export declare class VerifyPaystackChargeDto {
    reference: string;
}
export {};
