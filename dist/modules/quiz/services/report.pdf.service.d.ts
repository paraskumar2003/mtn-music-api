import { NeuroprofilingMailVariablesDto, NewNeuroprofilingMailVariablesDto } from '../dto/send-report.dto';
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
    generatePdfNew(data: NewNeuroprofilingMailVariablesDto & {
        questions: {
            question: string;
            focus: string;
            missed: string;
            hr_interpretation: string;
        }[];
        final_verdict: string;
    }): Promise<Buffer>;
    generatePdf(data: NeuroprofilingMailVariablesDto): Promise<Buffer>;
    generatePdfAndSendMail(data: NewNeuroprofilingMailVariablesDto & {
        questions: {
            question: string;
            focus: string;
            missed: string;
            hr_interpretation: string;
        }[];
        final_verdict: string;
    }): Promise<void>;
}
