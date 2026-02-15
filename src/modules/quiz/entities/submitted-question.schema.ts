import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Quiz } from './quiz.schema';
import { Question, ResponseType } from './question.schema';
import { MongoUser } from 'src/modules/users/schema/user.schema';
import { BaseSchema } from 'src/common/base.schema';

export type SubmittedQuestionDocument = SubmittedQuestion & Document;

@Schema({
    collection: 'submitted_questions',
})
export class SubmittedQuestion extends BaseSchema {
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

    // Answered timestamp
    @Prop({ default: null })
    answered_at?: Date;

    @Prop({ required: false })
    is_evaluated_by_llm: boolean;

    @Prop({ required: false })
    confidence_score?: number;

    @Prop({ required: false })
    reason?: string;

    @Prop({ required: false, type: SchemaTypes.Mixed })
    err_while_evaluation_by_llm: any;

    /** scores by category */
    @Prop({ required: false })
    visual?: number;

    @Prop({ required: false })
    auditory?: number;

    @Prop({ required: false })
    rhythmic?: number;

    @Prop({ required: false })
    subconscious?: number;

    @Prop({ required: false })
    candidates_approach?: string;

    @Prop({ required: false })
    demonstrated_strengths?: string;

    @Prop({ required: false })
    omissions_or_delays?: string;

    @Prop({ required: false })
    hr_interpretation?: string;
}

export const SubmittedQuestionSchema =
    SchemaFactory.createForClass(SubmittedQuestion);

// ⭐ Auto-update updated_at
SubmittedQuestionSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
