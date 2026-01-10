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
exports.KeyLockService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../redis/redis.service");
let KeyLockService = class KeyLockService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async lock(key, ttl = 10) {
        this.redisService.set(`keyLock${key}`, '1', 'EX', ttl);
    }
    async release(key) {
        this.redisService.del(`keyLock${key}`);
    }
    async wait(key) {
        while (true) {
            let ifKeyExists = await this.redisService.get(`keyLock${key}`);
            if (!ifKeyExists) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
};
exports.KeyLockService = KeyLockService;
exports.KeyLockService = KeyLockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], KeyLockService);
//# sourceMappingURL=key-lock.service.js.map