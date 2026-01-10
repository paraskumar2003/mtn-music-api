import { AuthService } from './auth.service';
import { MobileAuthDto } from './dto/mobile-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CustomLoggerService } from '../logger/logger.service';
import { RegisterHSWDto } from './dto/hsw/regsiter-hsw.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService, logger: CustomLoggerService);
    authenticateMobile(mobileAuthDto: MobileAuthDto): Promise<import("./dto/mobile-auth-response.dto").MobileAuthResponseDto>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<import("./dto/verify-otp-response.dto").VerifyOtpResponseDto>;
    register(registerHSWDto: RegisterHSWDto): Promise<any>;
}
