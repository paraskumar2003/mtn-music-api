import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Otp } from './entities/otp.entity';
import { IdempotencyModule } from 'src/idempotency/key-guard/idempotency.module';
import { MongoUsersController } from './controllers/mongo-user.controller';
import { MongoUsersService } from './services/mongo-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUser, MongoUserSchema } from './schema/user.schema';
import { OtpSchema } from './schema/otp.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Otp]),
        IdempotencyModule,
        MongooseModule.forFeature([
            { name: MongoUser.name, schema: MongoUserSchema },
            { name: Otp.name, schema: OtpSchema },
        ]),
    ],
    controllers: [MongoUsersController],
    providers: [UsersService, MongoUsersService],
    exports: [UsersService, MongoUsersService],
})
export class UsersModule {}
