import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { MongoUser, UserRole, MongoUserDocument } from '../mongo/user.schema';
import { RegisterUserDto } from '../dto/create-mongo-user.dto';

@Injectable()
export class MongoUsersService {
    constructor(
        @InjectModel(MongoUser.name)
        private readonly mongoUserModel: Model<MongoUserDocument>,
        private readonly configService: ConfigService,
    ) {}

    async registerUser(
        data: RegisterUserDto,
    ): Promise<{ access_token: string; user: MongoUser }> {
        const { name, mobile, email, password } = data;

        // Check if user already exists (by mobile or email)
        let user = await this.mongoUserModel.findOne({
            $or: [{ email }, { mobile }],
        });

        if (!user) {
            // Hash password and create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new this.mongoUserModel({
                name,
                mobile,
                email,
                password: hashedPassword,
                roles: [UserRole.USER],
            });
            await user.save();
        }

        // Generate JWT token
        const secret = this.configService.get<string>(
            'JWT_SECRET',
            'default_secret',
        );

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                mobile: user.mobile,
                roles: user.roles,
            },
            secret,
            { expiresIn: '15m' },
        );

        return {
            access_token: token,
            user,
        };
    }
}
