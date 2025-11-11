import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { MongoUsersService } from './mongo-users.service';
// import { MongoUser, MongoUserSchema } from './schemas/mongo-user.schema';

@Module({
    imports: [
        // MongooseModule.forFeature([
        //   { name: MongoUser.name, schema: MongoUserSchema },
        // ]),
    ],
    // providers: [MongoUsersService],
    // exports: [MongoUsersService],
})
export class MongoUsersModule {}
