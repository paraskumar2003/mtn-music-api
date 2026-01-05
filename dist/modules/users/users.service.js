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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const otp_entity_1 = require("./entities/otp.entity");
const class_transformer_1 = require("class-transformer");
const user_response_dto_1 = require("./dto/user-response.dto");
const base_service_1 = require("../../common/base.service");
let UsersService = class UsersService extends base_service_1.BaseService {
    constructor(userRepository, otpRepository) {
        super(userRepository);
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
    }
    async create(createUserDto) {
        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, savedUser);
    }
    async findAllUsers(filters = {}) {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.district', 'district');
        if (filters.active !== undefined) {
            queryBuilder.andWhere('user.active = :active', {
                active: filters.active,
            });
        }
        if (filters.role) {
            queryBuilder.andWhere('user.role = :role', { role: filters.role });
        }
        if (filters.districtId) {
            queryBuilder.andWhere('user.districtId = :districtId', {
                districtId: filters.districtId,
            });
        }
        const users = await queryBuilder.getMany();
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, users);
    }
    async findByMobile(mobile) {
        const user = await this.userRepository.findOne({
            where: { mobile },
            relations: ['district'],
        });
        return user ? (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user) : null;
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            return null;
        }
        await this.userRepository.update(id, updateUserDto);
        const updatedUser = await this.userRepository.findOne({
            where: { id },
            relations: ['district'],
        });
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, updatedUser);
    }
    async remove(id) {
        const result = await this.userRepository.softDelete(id);
        return result.affected > 0;
    }
    async generateOtp(mobile) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.update({ mobile, status: otp_entity_1.OtpStatus.PENDING }, { status: otp_entity_1.OtpStatus.EXPIRED });
        const otpEntity = this.otpRepository.create({
            mobile,
            otp,
            status: otp_entity_1.OtpStatus.PENDING,
            active: true,
        });
        await this.otpRepository.save(otpEntity);
        return otp;
    }
    async verifyOtp(mobile, otp) {
        const otpEntity = await this.otpRepository.findOne({
            where: {
                mobile,
                otp: otp.toString(),
                status: otp_entity_1.OtpStatus.PENDING,
                active: true,
            },
            order: {
                createdAt: -1,
            },
        });
        if (!otpEntity) {
            return false;
        }
        const otpAge = Date.now() - otpEntity.createdAt.getTime();
        const tenMinutes = 10 * 60 * 1000;
        if (otpAge > tenMinutes) {
            await this.otpRepository.update(otpEntity.id, {
                status: otp_entity_1.OtpStatus.EXPIRED,
            });
            return false;
        }
        await this.otpRepository.update(otpEntity.id, {
            status: otp_entity_1.OtpStatus.VERIFIED,
        });
        return true;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map