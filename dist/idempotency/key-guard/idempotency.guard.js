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
exports.IdempotencyGuard = void 0;
const common_1 = require("@nestjs/common");
const idempotency_service_1 = require("./idempotency.service");
let IdempotencyGuard = class IdempotencyGuard {
    constructor(idempotencyService) {
        this.idempotencyService = idempotencyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
            return true;
        }
        const idempotencyKey = request.headers['idempotency-key'];
        if (!idempotencyKey) {
            throw new common_1.HttpException('Idempotency-Key header is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const key = `idempotency:${request.path}:${idempotencyKey}`;
        const isProcessed = await this.idempotencyService.isProcessed(key);
        if (isProcessed) {
            const data = await this.idempotencyService.getProcessedData(key);
            response.status(common_1.HttpStatus.OK).json(data);
            return false;
        }
        const originalJson = response.json.bind(response);
        const idempotencyService = this.idempotencyService;
        response.json = (body) => {
            idempotencyService.markAsProcessed(key, body).catch(console.error);
            return originalJson(body);
        };
        return true;
    }
};
exports.IdempotencyGuard = IdempotencyGuard;
exports.IdempotencyGuard = IdempotencyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [idempotency_service_1.IdempotencyService])
], IdempotencyGuard);
//# sourceMappingURL=idempotency.guard.js.map