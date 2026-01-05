"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HmacService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let HmacService = class HmacService {
    createHmac(requestBody, key) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(requestBody);
        return hmac.digest('hex');
    }
};
exports.HmacService = HmacService;
exports.HmacService = HmacService = __decorate([
    (0, common_1.Injectable)()
], HmacService);
//# sourceMappingURL=hmac.service.js.map