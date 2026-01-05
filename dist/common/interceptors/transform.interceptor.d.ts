import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { IdempotencyService } from '../../idempotency';
import { Reflector } from '@nestjs/core';
export declare class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    private readonly idempotencyService;
    private readonly reflector;
    constructor(idempotencyService: IdempotencyService, reflector: Reflector);
    private readonly sensitiveFields;
    private sanitize;
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>>;
}
