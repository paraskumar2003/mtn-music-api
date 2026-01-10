import { ConfigService } from '@nestjs/config';
import { LoggerService } from './interfaces/logger.interface';
export declare class CustomLoggerService implements LoggerService {
    private configService;
    private logger;
    constructor(configService: ConfigService);
    private initializeLogger;
    private createLogData;
    log(tag: string, journeyId: string, data: Record<string, any>): void;
    error(tag: string, journeyId: string, data: Record<string, any>): void;
    warn(tag: string, journeyId: string, data: Record<string, any>): void;
    info(tag: string, journeyId: string, data: Record<string, any>): void;
}
