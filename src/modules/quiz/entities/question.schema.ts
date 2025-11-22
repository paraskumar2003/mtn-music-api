import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MongoUser } from '../../users/schema/user.schema';
import { Quiz } from './quiz.schema';
// import { Quiz } from './quiz.schema';

export type QuestionDocument = Question & Document;

export enum ResponseType {
    TEXT = 'text',
    AUDIO = 'audio',
    IMAGE = 'image',
    MCQ = 'mcq',
}

@Schema({ timestamps: true, collection: 'questions' })
export class Question {
    _id: Types.ObjectId;

    @Prop({ required: true })
    dimension: string;

    @Prop({ required: true })
    level: string;

    @Prop({ required: true })
    question_type: string;

    @Prop({ required: true })
    prompt_html: string;

    @Prop()
    image_url?: string;

    @Prop()
    audio_url?: string;

    @Prop({ type: [String], required: true })
    options: string[];

    @Prop({ required: false })
    answer: string;

    @Prop({
        type: [
            {
                options: { type: [String], required: true },
                score: { type: Number, required: true },
                dimension: { type: String, required: true },
                note: { type: String, required: false },
            },
        ],
        required: false,
    })
    rubric?: {
        options: string[];
        score: number;
        dimension: string;
        note?: string;
    }[];

    @Prop({ type: Types.ObjectId, ref: MongoUser.name, required: false })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Quiz.name, required: false })
    quiz: Types.ObjectId;

    @Prop({
        type: String,
        enum: ResponseType,
        required: true,
        default: ResponseType.MCQ,
    })
    response_type: ResponseType;

    @Prop({ required: false })
    is_evaluated_by_llm: boolean;

    @Prop({ required: false })
    confidence_score?: number;

    @Prop({ required: false })
    reason?: string;

    @Prop({ required: false })
    is_correct?: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
