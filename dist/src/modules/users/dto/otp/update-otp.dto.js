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
exports.UpdateOtpDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_otp_dto_1 = require("./create-otp.dto");
const class_validator_1 = require("class-validator");
const otp_entity_1 = require("../../entities/otp.entity");
class UpdateOtpDto extends (0, mapped_types_1.PartialType)(create_otp_dto_1.CreateOtpDto) {
}
exports.UpdateOtpDto = UpdateOtpDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(otp_entity_1.OtpStatus, {
        message: 'Status must be one of: pending, verified, expired',
    }),
    __metadata("design:type", String)
], UpdateOtpDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP must be exactly 6 digits' }),
    __metadata("design:type", String)
], UpdateOtpDto.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMobilePhone)('en-IN', {}, { message: 'Mobile number must be a valid Indian mobile number' }),
    __metadata("design:type", String)
], UpdateOtpDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Active must be a boolean value' }),
    __metadata("design:type", Boolean)
], UpdateOtpDto.prototype, "active", void 0);
//# sourceMappingURL=update-otp.dto.js.map