import { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/common/base.schema';
export type UserDetailsDocument = UserDetails & Document;
export declare class UserDetails extends BaseSchema {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    date_of_birth: Date;
    gender: string;
    education_level: String;
    current_role: string;
    organization: string;
    assessment_purpose: string;
    work_experience?: string;
    prior_tests_taken: boolean;
    additional_info?: Record<string, any>;
    agreement: boolean;
}
export declare const UserDetailsSchema: import("mongoose").Schema<UserDetails, import("mongoose").Model<UserDetails, any, any, any, Document<unknown, any, UserDetails, any, {}> & UserDetails & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserDetails, Document<unknown, {}, import("mongoose").FlatRecord<UserDetails>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserDetails> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
