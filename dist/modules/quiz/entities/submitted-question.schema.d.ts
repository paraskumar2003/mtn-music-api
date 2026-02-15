import { Document, Types } from 'mongoose';
import { ResponseType } from './question.schema';
import { BaseSchema } from 'src/common/base.schema';
export type SubmittedQuestionDocument = SubmittedQuestion & Document;
export declare class SubmittedQuestion extends BaseSchema {
    _id: Types.ObjectId;
    quiz: Types.ObjectId;
    question: Types.ObjectId;
    user: Types.ObjectId;
    response_type: ResponseType;
    response_text?: string;
    response_audio_url?: string;
    response_image_url?: string;
    is_correct?: boolean | null;
    score: number;
    dimension: string;
    answered_at?: Date;
    is_evaluated_by_llm: boolean;
    confidence_score?: number;
    reason?: string;
    err_while_evaluation_by_llm: any;
    visual?: number;
    auditory?: number;
    rhythmic?: number;
    subconscious?: number;
    candidates_approach?: string;
    demonstrated_strengths?: string;
    omissions_or_delays?: string;
    hr_interpretation?: string;
}
export declare const SubmittedQuestionSchema: import("mongoose").Schema<SubmittedQuestion, import("mongoose").Model<SubmittedQuestion, any, any, any, Document<unknown, any, SubmittedQuestion, any, {}> & SubmittedQuestion & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SubmittedQuestion, Document<unknown, {}, import("mongoose").FlatRecord<SubmittedQuestion>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SubmittedQuestion> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
