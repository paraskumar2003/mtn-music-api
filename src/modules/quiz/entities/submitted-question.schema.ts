import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from './quiz.schema';
import { Question, ResponseType } from './question.schema';
import { MongoUser } from 'src/modules/users/schema/user.schema';

export type SubmittedQuestionDocument = SubmittedQuestion & Document;

@Schema({
    timestamps: { createdAt: 'answered_at', updatedAt: false },
    collection: 'submitted_questions',
})
export class SubmittedQuestion {
    _id: Types.ObjectId;

    // Reference to the quiz in which this question was answered
    @Prop({ type: Types.ObjectId, ref: Quiz.name, required: true })
    quiz: Types.ObjectId;

    // The question that was answered
    @Prop({ type: Types.ObjectId, ref: Question.name, required: true })
    question: Types.ObjectId;

    // The user who answered this question
    @Prop({ type: Types.ObjectId, ref: MongoUser.name, required: true })
    user: Types.ObjectId;

    // The type of response — text, audio, image, mcq
    @Prop({
        type: String,
        enum: ResponseType,
        required: true,
        default: ResponseType.MCQ,
    })
    response_type: ResponseType;

    // The actual answer or response value
    @Prop({ required: false })
    response_text?: string;

    @Prop({ required: false })
    response_audio_url?: string;

    @Prop({ required: false })
    response_image_url?: string;

    // Whether the response was correct (for MCQ / text questions)
    @Prop({ required: false, default: null })
    is_correct?: boolean | null;

    // Score awarded for this question
    @Prop({ required: false, default: 0 })
    score: number;

    // The dimension this question belongs to (for quick analytics)
    @Prop({ required: true })
    dimension: string;

    // Optional evaluator note (for manual or subjective grading)
    @Prop({ required: false })
    evaluator_note?: string;

    // Answered timestamp
    answered_at?: Date;
}

export const SubmittedQuestionSchema =
    SchemaFactory.createForClass(SubmittedQuestion);
