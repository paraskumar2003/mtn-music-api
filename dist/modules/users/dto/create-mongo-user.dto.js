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
exports.RegisterUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RegisterUserDto {
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Name must be at least 2 characters' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of Birth is required' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Invalid date format' }),
    __metadata("design:type", Date)
], RegisterUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Gender is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Education Level is required' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "educationLevel", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Current Role/Area of Study is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Current Role must be at least 2 characters' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "currentRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "organization", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Purpose of Assessment is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "assessmentPurpose", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[0-9]{10}$/, { message: 'Mobile number must be 10 digits' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "workExperience", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Prior tests information is required' }),
    (0, class_validator_1.IsBoolean)({ message: 'Prior tests must be either true or false' }),
    __metadata("design:type", Boolean)
], RegisterUserDto.prototype, "priorTests", void 0);
//# sourceMappingURL=create-mongo-user.dto.js.map