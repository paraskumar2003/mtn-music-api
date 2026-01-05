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
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const idempotency_1 = require("../../idempotency");
const uuid_1 = require("uuid");
const cached_exception_1 = require("../exceptions/cached.exception");
const logger_service_1 = require("../../logger/logger.service");
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(idempotencyService, loggerService) {
        this.idempotencyService = idempotencyService;
        this.loggerService = loggerService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const timestamp = new Date().toISOString();
        const path = request.url;
        const requestId = request.headers['x-request-id'] || (0, uuid_1.v4)();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = [];
        let errorStack = null;
        let data = null;
        if (exception instanceof Error) {
            this.loggerService.error('Exception', request.journeyId, {
                error: exception.message,
                stack: exception.stack,
            });
            errors = [exception.message];
            errorStack = exception.stack.split('\n')[0];
        }
        if (exception instanceof common_1.HttpException) {
            const res = exception.getResponse();
            statusCode = exception.getStatus();
            message = res.message || exception.message;
            errors = res.message instanceof Array ? res.message : [res.message];
        }
        if (exception instanceof common_1.BadRequestException) {
            statusCode = common_1.HttpStatus.BAD_REQUEST;
        }
        let responseObj = {
            success: false,
            message: typeof message === 'string' ? message : message[0],
            data,
            errors,
            requestId,
            timestamp,
            statusCode,
            path,
            errorStack,
        };
        if (exception instanceof cached_exception_1.CachedResponseException) {
            responseObj = {
                ...responseObj,
                ...exception.cachedData,
                statusCode: exception.cachedData.statusCode,
            };
        }
        const key = request['idempotencyKey'];
        const shouldCache = request['shouldCacheResponse'];
        if (shouldCache && key) {
            this.idempotencyService
                .markAsProcessed(key, {
                statusCode,
                message,
                errors,
            })
                .catch(console.error);
        }
        if (!response.headersSent)
            response.status(responseObj.statusCode).json(responseObj);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [idempotency_1.IdempotencyService,
        logger_service_1.CustomLoggerService])
], AllExceptionsFilter);
//# sourceMappingURL=exception.filter.js.map