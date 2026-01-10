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
exports.MongoUsersController = void 0;
const common_1 = require("@nestjs/common");
const mongo_user_service_1 = require("../services/mongo-user.service");
const create_mongo_user_dto_1 = require("../dto/create-mongo-user.dto");
const verify_otp_dto_1 = require("../dto/otp/verify-otp.dto");
const intitiate_window_dto_1 = require("../dto/intitiate-window.dto");
let MongoUsersController = class MongoUsersController {
    constructor(mongoUsersService) {
        this.mongoUsersService = mongoUsersService;
    }
    async register(body) {
        const user = await this.mongoUsersService.registerUser(body);
        return { otp_sent: user.otp_sent };
    }
    async verifyOtp(body) {
        const result = await this.mongoUsersService.verifyOtp(body);
        return {
            otp_verified: result.otp_verified,
            access_token: result.access_token,
        };
    }
    async initiateWindow(query, res) {
        let { access_token } = await this.mongoUsersService.upsertUserByEmail({
            name: query.name,
            email: query.email,
            mobile: query.mobile,
            age: query.age,
            role: query.role,
        });
        return res.redirect('http://localhost:5173/open-window?access_token=' + access_token);
    }
    async verifyToken(access_token) {
        const result = await this.mongoUsersService.verifyToken(access_token);
        return {
            token_verified: result.token_verified,
        };
    }
};
exports.MongoUsersController = MongoUsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mongo_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], MongoUsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyEmailOtpDto]),
    __metadata("design:returntype", Promise)
], MongoUsersController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Get)('initiate-window'),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [intitiate_window_dto_1.InitiateWindowDto, Object]),
    __metadata("design:returntype", Promise)
], MongoUsersController.prototype, "initiateWindow", null);
__decorate([
    (0, common_1.Get)('verify-token'),
    __param(0, (0, common_1.Query)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MongoUsersController.prototype, "verifyToken", null);
exports.MongoUsersController = MongoUsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [mongo_user_service_1.MongoUsersService])
], MongoUsersController);
//# sourceMappingURL=mongo-user.controller.js.map