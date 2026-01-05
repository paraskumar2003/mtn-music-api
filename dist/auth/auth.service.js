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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../modules/users/users.service");
const logger_service_1 = require("../logger/logger.service");
const uuid_1 = require("uuid");
const user_entity_1 = require("../modules/users/entities/user.entity");
let AuthService = class AuthService {
    constructor(jwtService, usersService, logger) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.logger = logger;
        this.logger = logger;
    }
    async authenticateMobile(mobile) {
        let journeyId = (0, uuid_1.v4)();
        let user = await this.usersService.findByMobile(mobile);
        this.logger.info('USER_LOGIN_REQUEST', journeyId, {
            mobile,
            user,
            found: !!user,
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found. Please register first.');
        }
        const otp = await this.usersService.generateOtp(mobile);
        this.logger.info('OTP_GENERATED', journeyId, {
            mobile,
            otp,
        });
        console.log(`OTP for ${mobile}: ${otp}`);
        return {
            success: true,
            message: 'OTP sent. Please verify to log in.',
            data: null,
        };
    }
    async verifyOtp(verifyOtpDto) {
        const journeyId = (0, uuid_1.v4)();
        let user = await this.usersService.findByMobile(verifyOtpDto.mobile);
        if (!user) {
            this.logger.error('VERIFY_OTP_USER_NOT_FOUND', journeyId, {
                mobile: verifyOtpDto.mobile,
            });
            return {
                success: false,
                message: 'User not found. Please contact administrator.',
                data: {
                    access_token: null,
                    verified: false,
                },
            };
        }
        const isOtpValid = await this.usersService.verifyOtp(verifyOtpDto.mobile, verifyOtpDto.otp);
        if (!isOtpValid) {
            this.logger.error('VERIFY_OTP_INVALID', journeyId, {
                mobile: verifyOtpDto.mobile,
                otp: verifyOtpDto.otp,
            });
            return {
                success: false,
                message: 'OTP did not match.',
                data: {
                    access_token: null,
                    verified: false,
                },
            };
        }
        const token = this.jwtService.sign({
            id: user.id,
            mobile: user.mobile,
            role: user.role,
            active: user.active,
        });
        this.logger.info('VERIFY_OTP_SUCCESS', journeyId, {
            mobile: verifyOtpDto.mobile,
            userId: user.id,
        });
        return {
            success: true,
            message: 'User verified successfully!',
            data: {
                access_token: token,
                verified: true,
            },
        };
    }
    async registerHSW(registerHwsDto) {
        let isUserAlreadyExists = await this.usersService.findByMobile(registerHwsDto.mobile.trim());
        if (isUserAlreadyExists) {
            throw new common_1.BadRequestException('User already exists!');
        }
        const user = await this.usersService.create({
            name: registerHwsDto.name,
            mobile: registerHwsDto.mobile,
            role: user_entity_1.UserRole.HSW,
        });
        return {
            success: true,
            message: 'HSW registered successfully!',
            data: {
                userId: user.id,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        logger_service_1.CustomLoggerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map