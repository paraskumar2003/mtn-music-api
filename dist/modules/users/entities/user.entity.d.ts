import { BaseEntity } from '../../../common/base.entity';
import { UserStatus } from '../enum/user-status.enum';
export declare enum UserRole {
    HSW = "HSW",
    DC = "DC",
    TRAINER = "Trainer",
    ADMIN = "Admin",
    RECKITT = "Reckitt"
}
export declare class User extends BaseEntity {
    name: string;
    role: UserRole;
    mobile: string;
    email: string;
    active: boolean;
    status: UserStatus;
}
