import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomLoggerService } from 'src/logger/logger.service';
import { UserRole } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService, logger: CustomLoggerService);
    create(createUserDto: CreateUserDto): Promise<import("./dto/user-response.dto").UserResponseDto>;
    findAll(active?: string, role?: UserRole, districtId?: string): Promise<import("./entities/user.entity").User[]>;
    findOne(id: number): Promise<import("./entities/user.entity").User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("./dto/user-response.dto").UserResponseDto>;
    remove(id: number): Promise<void>;
}
