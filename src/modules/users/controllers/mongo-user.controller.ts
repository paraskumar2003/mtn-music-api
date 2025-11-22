import { Body, Controller, Post } from '@nestjs/common';
import { MongoUsersService } from '../services/mongo-user.service';
import { RegisterUserDto } from '../dto/create-mongo-user.dto';
import { VerifyEmailOtpDto } from '../dto/otp/verify-otp.dto';

@Controller('users')
export class MongoUsersController {
    constructor(private readonly mongoUsersService: MongoUsersService) {}

    @Post('register')
    async register(
        @Body()
        body: RegisterUserDto,
    ) {
        const user = await this.mongoUsersService.registerUser(body);
        return { otp_sent: user.otp_sent };
    }

    @Post('verify-otp')
    async verifyOtp(
        @Body()
        body: VerifyEmailOtpDto,
    ) {
        const result = await this.mongoUsersService.verifyOtp(body);
        return {
            otp_verified: result.otp_verified,
            access_token: result.access_token,
        };
    }
}
