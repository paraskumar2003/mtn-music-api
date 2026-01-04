import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Res,
    ValidationPipe,
} from '@nestjs/common';
import { MongoUsersService } from '../services/mongo-user.service';
import { RegisterUserDto } from '../dto/create-mongo-user.dto';
import { VerifyEmailOtpDto } from '../dto/otp/verify-otp.dto';
import { InitiateWindowDto } from '../dto/intitiate-window.dto';
import { Response } from 'express';

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

    @Get('initiate-window')
    async initiateWindow(
        @Query(new ValidationPipe({ transform: true, whitelist: true }))
        query: InitiateWindowDto,
        @Res() res: Response,
    ) {
        let { access_token } = await this.mongoUsersService.upsertUserByEmail({
            name: query.name,
            email: query.email,
            mobile: query.mobile,
            age: query.age,
            role: query.role,
        });

        return res.redirect(
            'http://localhost:5173/open-window?access_token=' + access_token,
        );
    }
}
