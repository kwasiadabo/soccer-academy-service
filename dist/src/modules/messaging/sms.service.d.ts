import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private readonly config;
    private readonly logger;
    private readonly apiKey?;
    private readonly senderId;
    private readonly endpoint;
    constructor(config: ConfigService);
    send(phone: string, message: string): Promise<boolean>;
}
