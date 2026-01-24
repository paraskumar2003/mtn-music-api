import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/common/base.schema';

export type UserDetailsDocument = UserDetails & Document;

@Schema({
    timestamps: true,
    collection: 'user_details',
})
export class UserDetails extends BaseSchema {
    _id: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'MongoUser',
        required: true,
        unique: true,
        index: true,
    })
    user_id: Types.ObjectId;

    @Prop({ required: true })
    date_of_birth: Date;

    @Prop({
        required: true,
    })
    gender: string;

    @Prop({
        required: true,
    })
    education_level: String;

    @Prop({ required: true })
    current_role: string;

    @Prop({ required: false })
    organization: string;

    @Prop({
        required: true,
    })
    assessment_purpose: string;

    @Prop({
        required: false,
    })
    work_experience?: string;

    @Prop({ required: true })
    prior_tests_taken: boolean;

    @Prop({
        type: Object,
        default: {},
    })
    additional_info?: Record<string, any>;
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);

// Create indexes for better query performance
UserDetailsSchema.index({ user_id: 1 }, { unique: true });
UserDetailsSchema.index({ assessment_purpose: 1 });
UserDetailsSchema.index({ education_level: 1 });
