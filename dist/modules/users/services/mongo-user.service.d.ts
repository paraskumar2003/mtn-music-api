import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MongoUser, MongoUserDocument } from '../schema/user.schema';
import { RegisterUserDto } from '../dto/create-mongo-user.dto';
import { VerifyEmailOtpDto } from '../dto/otp/verify-otp.dto';
import { Otp } from '../schema/otp.schema';
export declare class MongoUsersService {
    private readonly mongoUserModel;
    private readonly otpModel;
    private readonly configService;
    constructor(mongoUserModel: Model<MongoUserDocument>, otpModel: Model<Otp>, configService: ConfigService);
    private sendOtpEmail;
    registerUser(data: RegisterUserDto): Promise<{
        otp_sent: boolean;
    }>;
    verifyOtp(data: VerifyEmailOtpDto): Promise<{
        access_token: string;
        otp_verified: boolean;
    }>;
    getUserDetailsByUserId(user_id: string): Promise<import("mongoose").Document<unknown, {}, MongoUserDocument, {}, {}> & MongoUser & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    upsertUserByEmail(params: {
        name: string;
        email: string;
        mobile: string;
        age: number;
        role: string;
    }): Promise<any>;
    verifyToken(access_token: string): Promise<{
        token_verified: boolean;
    }>;
}
