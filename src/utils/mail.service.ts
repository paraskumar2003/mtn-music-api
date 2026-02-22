import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import axios from 'axios';

interface SendMailDto {
    to: string | string[];
    from: string;
    cc?: string | string[];
    mailSubject: string;
    text?: string;
    htmlContent?: string;
    attachments?: string[]; // S3 URLs
}

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    /**
     * Sends an email via SendGrid and updates DB status
     */
    async sendMail(data: SendMailDto): Promise<void> {
        try {
            const msg: sgMail.MailDataRequired = {
                to: data.to,
                from: data.from,
                subject: data.mailSubject,
                ...(data.cc && { cc: data.cc }),
                ...(data.text && { text: data.text }),
                ...(data.htmlContent && { html: data.htmlContent }),
            };

            if (data.attachments?.length) {
                msg.attachments = await this.generateAttachments(
                    data.attachments,
                );
            }

            const [response] = await sgMail.send(msg);

            this.logger.log(
                `📨 Email sent successfully (Message ID: ${response.headers['x-message-id'] ?? response.statusCode})`,
            );
        } catch (error) {
            this.logger.error(
                `❌ Failed to send email (Message ID: ${error?.response?.headers['x-message-id'] ?? error?.response?.statusCode})`,
                error.stack,
            );

            throw error;
        }
    }

    /**
     * Converts S3 URLs into SendGrid-compatible attachments
     */
    private async generateAttachments(s3Urls: string[]): Promise<
        Array<{
            content: string;
            filename: string;
            type: string;
            disposition: 'attachment';
        }>
    > {
        const attachments = [];

        for (const url of s3Urls) {
            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                });

                const filename = decodeURIComponent(
                    url.split('/').pop() ?? 'attachment',
                );

                const mimeType =
                    response.headers['content-type'] ||
                    'application/octet-stream';

                const base64Content = Buffer.from(response.data).toString(
                    'base64',
                );

                attachments.push({
                    content: base64Content,
                    filename,
                    type: mimeType,
                    disposition: 'attachment',
                });
            } catch (error) {
                this.logger.warn(
                    `⚠️ Failed to fetch attachment from ${url}: ${error.message}`,
                );
            }
        }

        return attachments;
    }
}
