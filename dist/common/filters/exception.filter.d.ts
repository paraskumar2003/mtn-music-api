import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { IdempotencyService } from '../../idempotency';
import { CustomLoggerService } from '../../logger/logger.service';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly idempotencyService;
    private readonly loggerService;
    constructor(idempotencyService: IdempotencyService, loggerService: CustomLoggerService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
