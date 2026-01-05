import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/base.schema';
export type OtpDocument = Otp & Document;
export declare enum OtpStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    EXPIRED = "expired"
}
export declare class Otp extends BaseSchema {
    status: OtpStatus;
    otp: string;
    email: string;
    active: boolean;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, Document<unknown, any, Otp, any, {}> & Otp & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, Document<unknown, {}, import("mongoose").FlatRecord<Otp>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Otp> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
