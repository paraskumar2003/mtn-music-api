interface SendMailDto {
    to: string | string[];
    from: string;
    cc?: string | string[];
    mailSubject: string;
    text?: string;
    htmlContent?: string;
    attachments?: string[];
}
export declare class MailService {
    private readonly logger;
    constructor();
    sendMail(data: SendMailDto): Promise<void>;
    private generateAttachments;
}
export {};
