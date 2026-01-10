import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    role: UserRole;
    mobile: string;
    email?: string;
    active?: boolean;
}
