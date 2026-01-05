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
exports.KeyLockGuard = void 0;
const common_1 = require("@nestjs/common");
const key_lock_service_1 = require("./key-lock.service");
let KeyLockGuard = class KeyLockGuard {
    constructor(keyLockService) {
        this.keyLockService = keyLockService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        await this.keyLockService.wait(request.user.id);
        await this.keyLockService.lock(request.user.id);
        response.on('finish', async () => {
            await this.keyLockService.release(request.user.id);
        });
        return true;
    }
};
exports.KeyLockGuard = KeyLockGuard;
exports.KeyLockGuard = KeyLockGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [key_lock_service_1.KeyLockService])
], KeyLockGuard);
//# sourceMappingURL=key-lock.guard.js.map