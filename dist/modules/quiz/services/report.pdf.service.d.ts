import { NeuroprofilingMailVariablesDto } from '../dto/send-report.dto';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../../logger/logger.service';
export declare class ReportPdfService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService, logger: CustomLoggerService);
    private strength_text;
    private getLevel;
    private generateAttachments;
    private sendMail;
    private sectionTitle;
    private kv;
    private subSection;
    generatePdf(data: NeuroprofilingMailVariablesDto): Promise<Buffer>;
    generatePdfAndSendMail(data: NeuroprofilingMailVariablesDto): Promise<void>;
}
