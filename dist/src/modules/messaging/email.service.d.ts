import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly config;
    private readonly logger;
    private readonly transporter;
    private readonly fromAddress?;
    constructor(config: ConfigService);
    send(params: {
        to: string;
        subject: string;
        html: string;
        attachments?: {
            filename: string;
            path: string;
            cid: string;
        }[];
    }): Promise<boolean>;
}
