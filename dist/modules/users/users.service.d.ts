import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Otp } from './entities/otp.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { BaseService } from 'src/common/base.service';
export declare class UsersService extends BaseService<User> {
    private readonly userRepository;
    private readonly otpRepository;
    constructor(userRepository: Repository<User>, otpRepository: Repository<Otp>);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAllUsers(filters?: {
        active?: boolean;
        role?: UserRole;
        districtId?: number;
    }): Promise<UserResponseDto[]>;
    findByMobile(mobile: string): Promise<UserResponseDto | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto | null>;
    remove(id: number): Promise<boolean>;
    generateOtp(mobile: string): Promise<string>;
    verifyOtp(mobile: string, otp: number): Promise<boolean>;
}
