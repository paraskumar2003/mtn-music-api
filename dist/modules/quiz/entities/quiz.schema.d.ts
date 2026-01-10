import { Document, Types } from 'mongoose';
export type QuizDocument = Quiz & Document;
export declare class Quiz {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    total_questions: number;
    total_score: number;
    played_at?: Date;
}
export declare const QuizSchema: import("mongoose").Schema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz, any, {}> & Quiz & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Quiz> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
