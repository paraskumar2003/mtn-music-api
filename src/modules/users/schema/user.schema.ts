import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/common/base.schema';

export type MongoUserDocument = MongoUser & Document;

// Enum for roles
export enum UserRole {
    ADMIN = 'admin',
    DEALER = 'dealer',
    USER = 'user',
}

@Schema({
    timestamps: { createdAt: 'registered_at', updatedAt: true },
    collection: 'users',
})
export class MongoUser extends BaseSchema {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    mobile: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: false })
    age: string;

    @Prop({ required: false })
    working_role: string;

    @Prop({ required: false })
    password: string;

    @Prop({ default: true })
    is_active: boolean;

    @Prop({
        type: [String],
        enum: Object.values(UserRole),
        default: [UserRole.USER],
    })
    roles: UserRole[];

    @Prop({
        type: Types.ObjectId,
        ref: 'UserDetails',
        required: false,
    })
    user_details?: Types.ObjectId;
}

export const MongoUserSchema = SchemaFactory.createForClass(MongoUser);
