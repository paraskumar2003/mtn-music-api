import { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/common/base.schema';
export type MongoUserDocument = MongoUser & Document;
export declare enum UserRole {
    ADMIN = "admin",
    DEALER = "dealer",
    USER = "user"
}
export declare class MongoUser extends BaseSchema {
    _id: Types.ObjectId;
    name: string;
    mobile: string;
    email: string;
    age: string;
    working_role: string;
    password: string;
    is_active: boolean;
    roles: UserRole[];
}
export declare const MongoUserSchema: import("mongoose").Schema<MongoUser, import("mongoose").Model<MongoUser, any, any, any, Document<unknown, any, MongoUser, any, {}> & MongoUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MongoUser, Document<unknown, {}, import("mongoose").FlatRecord<MongoUser>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MongoUser> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
