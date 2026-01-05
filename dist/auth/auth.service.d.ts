import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { MobileAuthResponseDto } from './dto/mobile-auth-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { CustomLoggerService } from 'src/logger/logger.service';
import { RegisterHSWDto } from './dto/hsw/regsiter-hsw.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private readonly logger;
    constructor(jwtService: JwtService, usersService: UsersService, logger: CustomLoggerService);
    authenticateMobile(mobile: string): Promise<MobileAuthResponseDto>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<VerifyOtpResponseDto>;
    registerHSW(registerHwsDto: RegisterHSWDto): Promise<any>;
}
