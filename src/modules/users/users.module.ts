import { Module } from '@nestjs/common';
import { Otp } from './entities/otp.entity';
import { IdempotencyModule } from 'src/idempotency/key-guard/idempotency.module';
import { MongoUsersController } from './controllers/mongo-user.controller';
import { MongoUsersService } from './services/mongo-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUser, MongoUserSchema } from './schema/user.schema';
import { OtpSchema } from './schema/otp.schema';

@Module({
    imports: [
        IdempotencyModule,
        MongooseModule.forFeature([
            { name: MongoUser.name, schema: MongoUserSchema },
            { name: Otp.name, schema: OtpSchema },
        ]),
    ],
    controllers: [MongoUsersController],
    providers: [MongoUsersService],
    exports: [MongoUsersService],
})
export class UsersModule {}
