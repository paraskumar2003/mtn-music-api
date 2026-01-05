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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const logger_service_1 = require("../../logger/logger.service");
const idempotency_guard_1 = require("../../idempotency/key-guard/idempotency.guard");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_entity_1 = require("./entities/user.entity");
const uuid_1 = require("uuid");
let UsersController = class UsersController {
    constructor(usersService, logger) {
        this.usersService = usersService;
        this.logger = logger;
    }
    async create(createUserDto) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('CREATE_USER_REQUEST', journeyId, {
            dto: createUserDto,
        });
        const result = await this.usersService.create(createUserDto);
        this.logger.info('CREATE_USER_RESPONSE', journeyId, { result });
        return result;
    }
    async findAll(active, role, districtId) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('GET_USERS_REQUEST', journeyId, {
            active,
            role,
            districtId,
        });
        const result = await this.usersService.findAll({
            where: {
                role,
            },
        });
        this.logger.info('GET_USERS_RESPONSE', journeyId, {
            count: result.length,
        });
        return result;
    }
    async findOne(id) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('GET_USER_REQUEST', journeyId, { id });
        const user = await this.usersService.findOneById(id);
        if (!user) {
            this.logger.error('GET_USER_NOT_FOUND', journeyId, { id });
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.logger.info('GET_USER_RESPONSE', journeyId, { user });
        return user;
    }
    async update(id, updateUserDto) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('UPDATE_USER_REQUEST', journeyId, {
            id,
            dto: updateUserDto,
        });
        const updatedUser = await this.usersService.update(id, updateUserDto);
        if (!updatedUser) {
            this.logger.error('UPDATE_USER_NOT_FOUND', journeyId, { id });
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.logger.info('UPDATE_USER_RESPONSE', journeyId, {
            user: updatedUser,
        });
        return updatedUser;
    }
    async remove(id) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('DELETE_USER_REQUEST', journeyId, { id });
        const result = await this.usersService.remove(id);
        if (!result) {
            this.logger.error('DELETE_USER_NOT_FOUND', journeyId, { id });
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.logger.info('DELETE_USER_SUCCESS', journeyId, { id });
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(idempotency_guard_1.IdempotencyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('active')),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Query)('districtId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(idempotency_guard_1.IdempotencyGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        logger_service_1.CustomLoggerService])
], UsersController);
//# sourceMappingURL=users.controller.js.map