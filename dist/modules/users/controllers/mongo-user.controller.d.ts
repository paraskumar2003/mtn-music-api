import { MongoUsersService } from '../services/mongo-user.service';
import { RegisterUserDto } from '../dto/create-mongo-user.dto';
import { VerifyEmailOtpDto } from '../dto/otp/verify-otp.dto';
import { InitiateWindowDto } from '../dto/intitiate-window.dto';
import { Response } from 'express';
export declare class MongoUsersController {
    private readonly mongoUsersService;
    constructor(mongoUsersService: MongoUsersService);
    register(body: RegisterUserDto): Promise<{
        otp_sent: boolean;
    }>;
    verifyOtp(body: VerifyEmailOtpDto): Promise<{
        otp_verified: boolean;
        access_token: string;
    }>;
    initiateWindow(query: InitiateWindowDto, res: Response): Promise<void>;
    verifyToken(access_token: string): Promise<{
        token_verified: boolean;
    }>;
}
