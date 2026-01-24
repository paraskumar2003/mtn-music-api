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
exports.UserDetailsSchema = exports.UserDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_1 = require("../../../common/base.schema");
let UserDetails = class UserDetails extends base_schema_1.BaseSchema {
};
exports.UserDetails = UserDetails;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'MongoUser',
        required: true,
        unique: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], UserDetails.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], UserDetails.prototype, "date_of_birth", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], UserDetails.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], UserDetails.prototype, "education_level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserDetails.prototype, "current_role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], UserDetails.prototype, "organization", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], UserDetails.prototype, "assessment_purpose", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: false,
    }),
    __metadata("design:type", String)
], UserDetails.prototype, "work_experience", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], UserDetails.prototype, "prior_tests_taken", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {},
    }),
    __metadata("design:type", Object)
], UserDetails.prototype, "additional_info", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], UserDetails.prototype, "agreement", void 0);
exports.UserDetails = UserDetails = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'user_details',
    })
], UserDetails);
exports.UserDetailsSchema = mongoose_1.SchemaFactory.createForClass(UserDetails);
exports.UserDetailsSchema.index({ user_id: 1 }, { unique: true });
exports.UserDetailsSchema.index({ assessment_purpose: 1 });
exports.UserDetailsSchema.index({ education_level: 1 });
//# sourceMappingURL=user-detail.schema.js.map