import { BaseEntity } from '../../../common/base.entity';
export declare enum OtpStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    EXPIRED = "expired"
}
export declare class Otp extends BaseEntity {
    status: OtpStatus;
    otp: string;
    mobile: string;
    active: boolean;
}
