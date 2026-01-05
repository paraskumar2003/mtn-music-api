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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
const idempotency_1 = require("../../idempotency");
const cached_exception_1 = require("../exceptions/cached.exception");
const core_1 = require("@nestjs/core");
const skip_tranform_interceptor_1 = require("./skip-tranform.interceptor");
let TransformInterceptor = class TransformInterceptor {
    constructor(idempotencyService, reflector) {
        this.idempotencyService = idempotencyService;
        this.reflector = reflector;
        this.sensitiveFields = [
            'id',
            'password',
            'created_at',
            'updated_at',
            'active',
            'deleted_at',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ];
    }
    sanitize(value, seen = new WeakSet()) {
        if (Array.isArray(value)) {
            return value.map(v => this.sanitize(v, seen));
        }
        if (value instanceof Date || Buffer.isBuffer(value)) {
            return value;
        }
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return undefined;
            }
            seen.add(value);
            const clean = {};
            for (const key in value) {
                if (!this.sensitiveFields.includes(key)) {
                    clean[key] = this.sanitize(value[key], seen);
                }
            }
            return clean;
        }
        return value;
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const isSkipped = this.reflector.get(skip_tranform_interceptor_1.SKIP_INTERCEPTOR, context.getHandler()) ||
            this.reflector.get(skip_tranform_interceptor_1.SKIP_INTERCEPTOR, context.getClass());
        if (isSkipped) {
            return next.handle();
        }
        const requestId = request.headers['x-request-id'] || (0, uuid_1.v4)();
        const timestamp = new Date().toISOString();
        const statusCode = response.statusCode;
        const path = request.url;
        return next.handle().pipe((0, operators_1.map)(data => {
            const idempotencyKey = request['idempotencyKey'];
            const shouldCacheResponse = request['shouldCacheResponse'];
            const cachedResponse = request['idempotencyCachedResponse'];
            if (cachedResponse) {
                return {
                    success: true,
                    message: 'Idempotent response',
                    data: cachedResponse,
                    ...cachedResponse,
                    requestId,
                    timestamp,
                    statusCode,
                    path,
                };
            }
            const isWrapped = data &&
                typeof data === 'object' &&
                'success' in data &&
                'message' in data;
            const transformedData = isWrapped
                ? {
                    ...this.sanitize(data),
                    requestId,
                    timestamp,
                    statusCode,
                    path,
                }
                : {
                    success: data?.success || true,
                    message: 'Request processed successfully',
                    data: this.sanitize(data),
                    requestId,
                    timestamp,
                    statusCode,
                    path,
                };
            if (shouldCacheResponse && idempotencyKey) {
                this.idempotencyService
                    .markAsProcessed(idempotencyKey, transformedData)
                    .catch(err => console.error('Error caching idempotent response:', err));
            }
            return transformedData;
        }), (0, operators_1.catchError)(err => {
            if (err instanceof cached_exception_1.CachedResponseException) {
                return (0, rxjs_1.of)({
                    success: true,
                    message: 'Idempotent response',
                    data: this.sanitize(err.cachedData),
                    ...err.cachedData,
                    requestId,
                    timestamp,
                    statusCode: 200,
                    path,
                });
            }
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [idempotency_1.IdempotencyService,
        core_1.Reflector])
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map