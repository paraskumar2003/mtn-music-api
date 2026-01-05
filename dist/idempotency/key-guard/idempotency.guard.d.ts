import { CanActivate, ExecutionContext } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
export declare class IdempotencyGuard implements CanActivate {
    private readonly idempotencyService;
    constructor(idempotencyService: IdempotencyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
