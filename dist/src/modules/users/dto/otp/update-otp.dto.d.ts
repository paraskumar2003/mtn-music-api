import { CreateOtpDto } from './create-otp.dto';
import { OtpStatus } from '../../entities/otp.entity';
declare const UpdateOtpDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateOtpDto>>;
export declare class UpdateOtpDto extends UpdateOtpDto_base {
    status?: OtpStatus;
    otp?: string;
    mobile?: string;
    active?: boolean;
}
export {};
