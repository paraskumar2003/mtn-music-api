import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MongoUser } from 'src/modules/users/schema/user.schema';

export type QuizDocument = Quiz & Document;

@Schema({
    timestamps: { createdAt: 'played_at', updatedAt: false },
    collection: 'quizzes',
})
export class Quiz {
    _id: Types.ObjectId;

    // Which user played this quiz
    @Prop({ type: Types.ObjectId, ref: MongoUser.name, required: true })
    user: Types.ObjectId;

    // Total number of questions in the quiz
    @Prop({ required: true })
    total_questions: number;

    // User's total score in that quiz
    @Prop({ required: true })
    total_score: number;

    // Played timestamp handled by timestamps option
    played_at?: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
