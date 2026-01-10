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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base.entity");
const user_status_enum_1 = require("../enum/user-status.enum");
var UserRole;
(function (UserRole) {
    UserRole["HSW"] = "HSW";
    UserRole["DC"] = "DC";
    UserRole["TRAINER"] = "Trainer";
    UserRole["ADMIN"] = "Admin";
    UserRole["RECKITT"] = "Reckitt";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User extends base_entity_1.BaseEntity {
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        comment: 'Full name of the user',
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        comment: 'Role of the user in the system (HSW, DC, Trainer, Admin, Reckitt)',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 15,
        unique: true,
        comment: 'Mobile phone number of the user',
    }),
    (0, typeorm_1.Index)('idx_user_mobile'),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: 'Email address of the user',
    }),
    (0, typeorm_1.Index)('IDX_USER_EMAIL'),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: true,
        comment: 'Whether the user account is active or not',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: user_status_enum_1.UserStatus, default: user_status_enum_1.UserStatus.Active }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)('IDX_USER_NAME', ['name']),
    (0, typeorm_1.Index)('IDX_USER_ROLE', ['role']),
    (0, typeorm_1.Index)('IDX_USER_ACTIVE', ['active'])
], User);
//# sourceMappingURL=user.entity.js.map