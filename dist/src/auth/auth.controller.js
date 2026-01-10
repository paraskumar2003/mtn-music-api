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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const mobile_auth_dto_1 = require("./dto/mobile-auth.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const logger_service_1 = require("../logger/logger.service");
const idempotency_guard_1 = require("../idempotency/key-guard/idempotency.guard");
const uuid_1 = require("uuid");
const regsiter_hsw_dto_1 = require("./dto/hsw/regsiter-hsw.dto");
let AuthController = class AuthController {
    constructor(authService, logger) {
        this.authService = authService;
        this.logger = logger;
    }
    async authenticateMobile(mobileAuthDto) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('AUTH_MOBILE_REQUEST', journeyId, {
            mobile: mobileAuthDto.mobile,
        });
        try {
            const result = await this.authService.authenticateMobile(mobileAuthDto.mobile);
            this.logger.info('AUTH_MOBILE_RESPONSE', journeyId, { result });
            return result;
        }
        catch (error) {
            this.logger.error('AUTH_MOBILE_ERROR', journeyId, {
                mobile: mobileAuthDto.mobile,
                error: error.message,
            });
            throw error;
        }
    }
    async verifyOtp(verifyOtpDto) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('VERIFY_OTP_REQUEST', journeyId, {
            mobile: verifyOtpDto.mobile,
            otp: verifyOtpDto.otp,
        });
        try {
            const result = await this.authService.verifyOtp(verifyOtpDto);
            this.logger.info('VERIFY_OTP_RESPONSE', journeyId, {
                success: result.success,
                verified: result.data.verified,
            });
            return result;
        }
        catch (error) {
            this.logger.error('VERIFY_OTP_ERROR', journeyId, {
                mobile: verifyOtpDto.mobile,
                error: error.message,
            });
            throw error;
        }
    }
    async register(registerHSWDto) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('REGISTER_HSW_REQUEST', journeyId, {
            mobile: registerHSWDto.mobile,
            name: registerHSWDto.name,
            districtId: registerHSWDto.district,
        });
        try {
            const result = await this.authService.registerHSW(registerHSWDto);
            this.logger.info('REGISTER_HSW_RESPONSE', journeyId, {
                success: result.success,
                userId: result.data.userId,
            });
            return result;
        }
        catch (error) {
            this.logger.error('REGISTER_HSW_ERROR', journeyId, {
                mobile: registerHSWDto.mobile,
                error: error.message,
            });
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('mobile'),
    (0, common_1.UseGuards)(idempotency_guard_1.IdempotencyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mobile_auth_dto_1.MobileAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateMobile", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [regsiter_hsw_dto_1.RegisterHSWDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        logger_service_1.CustomLoggerService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map