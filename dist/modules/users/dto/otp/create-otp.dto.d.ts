import { OtpStatus } from '../../entities/otp.entity';
export declare class CreateOtpDto {
    status: OtpStatus;
    otp: string;
    mobile: string;
    active?: boolean;
}
