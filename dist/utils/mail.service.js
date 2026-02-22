"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const sgMail = require("@sendgrid/mail");
const axios_1 = require("axios");
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
    async sendMail(data) {
        try {
            const msg = {
                to: data.to,
                from: data.from,
                subject: data.mailSubject,
                ...(data.cc && { cc: data.cc }),
                ...(data.text && { text: data.text }),
                ...(data.htmlContent && { html: data.htmlContent }),
            };
            if (data.attachments?.length) {
                msg.attachments = await this.generateAttachments(data.attachments);
            }
            const [response] = await sgMail.send(msg);
            this.logger.log(`📨 Email sent successfully (Message ID: ${response.headers['x-message-id'] ?? response.statusCode})`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to send email (Message ID: ${error?.response?.headers['x-message-id'] ?? error?.response?.statusCode})`, error.stack);
            throw error;
        }
    }
    async generateAttachments(s3Urls) {
        const attachments = [];
        for (const url of s3Urls) {
            try {
                const response = await axios_1.default.get(url, {
                    responseType: 'arraybuffer',
                });
                const filename = decodeURIComponent(url.split('/').pop() ?? 'attachment');
                const mimeType = response.headers['content-type'] ||
                    'application/octet-stream';
                const base64Content = Buffer.from(response.data).toString('base64');
                attachments.push({
                    content: base64Content,
                    filename,
                    type: mimeType,
                    disposition: 'attachment',
                });
            }
            catch (error) {
                this.logger.warn(`⚠️ Failed to fetch attachment from ${url}: ${error.message}`);
            }
        }
        return attachments;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map