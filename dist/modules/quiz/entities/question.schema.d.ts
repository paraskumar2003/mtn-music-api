import { Document, Types } from 'mongoose';
export type QuestionDocument = Question & Document;
export declare enum ResponseType {
    TEXT = "text",
    AUDIO = "audio",
    IMAGE = "image",
    MCQ = "mcq"
}
export declare class Question {
    _id: Types.ObjectId;
    dimension: string;
    level: string;
    question_type: ResponseType;
    prompt_html: string;
    image_url?: string;
    audio_url?: string;
    options: string[];
    answer: string;
    rubric?: {
        options: string[];
        score: number;
        dimension: string;
        note?: string;
    }[];
    user: Types.ObjectId;
    quiz: Types.ObjectId;
}
export declare const QuestionSchema: import("mongoose").Schema<Question, import("mongoose").Model<Question, any, any, any, Document<unknown, any, Question, any, {}> & Question & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Question, Document<unknown, {}, import("mongoose").FlatRecord<Question>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Question> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
