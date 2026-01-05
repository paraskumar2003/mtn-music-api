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
exports.Otp = exports.OtpStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base.entity");
var OtpStatus;
(function (OtpStatus) {
    OtpStatus["PENDING"] = "pending";
    OtpStatus["VERIFIED"] = "verified";
    OtpStatus["EXPIRED"] = "expired";
})(OtpStatus || (exports.OtpStatus = OtpStatus = {}));
let Otp = class Otp extends base_entity_1.BaseEntity {
};
exports.Otp = Otp;
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OtpStatus,
        comment: 'Status of the OTP',
    }),
    __metadata("design:type", String)
], Otp.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 6,
        comment: 'OTP code',
    }),
    __metadata("design:type", String)
], Otp.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 15,
        unique: true,
        comment: 'Mobile phone number of the user',
    }),
    (0, typeorm_1.Index)('idx_user_mobile'),
    __metadata("design:type", String)
], Otp.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: true,
        comment: 'Whether the OTP record is active or not',
    }),
    __metadata("design:type", Boolean)
], Otp.prototype, "active", void 0);
exports.Otp = Otp = __decorate([
    (0, typeorm_1.Entity)('otps'),
    (0, typeorm_1.Index)('IDX_OTP_STATUS', ['status']),
    (0, typeorm_1.Index)('IDX_OTP_ACTIVE', ['active'])
], Otp);
//# sourceMappingURL=otp.entity.js.map