import { UserRole } from '../entities/user.entity';
export declare class UserResponseDto {
    id: number;
    name: string;
    role: UserRole;
    mobile: string;
    email: string;
    districtId: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    district?: {
        id: number;
        name: string;
    };
}
