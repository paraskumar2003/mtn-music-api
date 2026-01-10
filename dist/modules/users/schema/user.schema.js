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
exports.MongoUserSchema = exports.MongoUser = exports.UserRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const base_schema_1 = require("../../../common/base.schema");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["DEALER"] = "dealer";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
let MongoUser = class MongoUser extends base_schema_1.BaseSchema {
};
exports.MongoUser = MongoUser;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MongoUser.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], MongoUser.prototype, "mobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], MongoUser.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], MongoUser.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], MongoUser.prototype, "working_role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], MongoUser.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], MongoUser.prototype, "is_active", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: Object.values(UserRole),
        default: [UserRole.USER],
    }),
    __metadata("design:type", Array)
], MongoUser.prototype, "roles", void 0);
exports.MongoUser = MongoUser = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: 'registered_at', updatedAt: true },
        collection: 'users',
    })
], MongoUser);
exports.MongoUserSchema = mongoose_1.SchemaFactory.createForClass(MongoUser);
//# sourceMappingURL=user.schema.js.map