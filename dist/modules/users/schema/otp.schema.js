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
exports.OtpSchema = exports.Otp = exports.OtpStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const base_schema_1 = require("../../../common/base.schema");
var OtpStatus;
(function (OtpStatus) {
    OtpStatus["PENDING"] = "pending";
    OtpStatus["VERIFIED"] = "verified";
    OtpStatus["EXPIRED"] = "expired";
})(OtpStatus || (exports.OtpStatus = OtpStatus = {}));
let Otp = class Otp extends base_schema_1.BaseSchema {
};
exports.Otp = Otp;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(OtpStatus),
        default: OtpStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], Otp.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        minlength: 4,
        maxlength: 6,
    }),
    __metadata("design:type", String)
], Otp.prototype, "otp", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        index: true,
        minlength: 10,
        maxlength: 30,
    }),
    __metadata("design:type", String)
], Otp.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: true,
        index: true,
    }),
    __metadata("design:type", Boolean)
], Otp.prototype, "active", void 0);
exports.Otp = Otp = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'otps',
    })
], Otp);
exports.OtpSchema = mongoose_1.SchemaFactory.createForClass(Otp);
//# sourceMappingURL=otp.schema.js.map