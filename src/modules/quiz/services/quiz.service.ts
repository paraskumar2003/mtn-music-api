import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz, QuizDocument } from '../entities/quiz.schema';
import {
    Question,
    QuestionDocument,
    ResponseType,
} from '../entities/question.schema';
import { AnswerQuestionDto } from '../dto/submit-answer.dto';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name)
        private quizModel: Model<QuizDocument>,
        @InjectModel(Question.name)
        private questionModel: Model<QuestionDocument>,
    ) {}

    /** 🎯 Initiate quiz — send one question to user */
    async initiateQuiz(dto: { user_id: Types.ObjectId }) {
        // Pick a random question
        const question = await this.questionModel.aggregate([
            { $sample: { size: 1 } },
        ]);
        if (!question.length)
            throw new NotFoundException('No questions available');

        const createdQuiz = await this.quizModel.create({
            user: new Types.ObjectId(dto.user_id),
            questions: [question[0]._id],
            total_questions: 1,
            total_score: 0,
        });

        console.log(createdQuiz);
        console.log(question);

        return {
            message: '✅ Quiz started successfully',
            quiz_id: createdQuiz._id.toString(),
            question: {
                question_id: question[0]._id.toString(),
                prompt_html: question[0].prompt_html,
                image_url: question[0].image_url,
                audio_url: question[0].audio_url,
                options: question[0].options,
                dimension: question[0].dimension,
                level: question[0].level,
                question_type: question[0].question_type,
                rubric: question[0].rubric,
            },
        };
    }

    /** 🧠 Answer API — validate answer and update score dimension-wise */
    async answerQuestion(dto: AnswerQuestionDto) {
        const { quiz_id, question_id, answer } = dto;

        const quiz = await this.quizModel.findById(quiz_id);
        if (!quiz) throw new NotFoundException('Quiz not found');

        const question = await this.questionModel.findById(question_id);
        if (!question) throw new NotFoundException('Question not found');

        // ✅ Check if this question has already been answered in this quiz
        const alreadyAnswered = quiz.questions.some(
            q => q.toString() === question_id,
        );

        if (alreadyAnswered) {
            throw new BadRequestException(
                'This question has already been answered.',
            );
        }

        // Initialize scores
        let score = 0;
        const dimensionImpacts: Record<string, number> = {};

        // ✅ 1. Check rubric-based scoring
        if (question.response_type === ResponseType.MCQ) {
            if (Array.isArray(question.rubric) && question.rubric.length > 0) {
                // Find matching rubric rule(s)
                for (const rule of question.rubric) {
                    if (rule.options.includes(answer)) {
                        score += rule.score;

                        // Update dimension-wise score map
                        if (!dimensionImpacts[rule.dimension]) {
                            dimensionImpacts[rule.dimension] = 0;
                        }
                        dimensionImpacts[rule.dimension] += rule.score;
                    }
                }
            } else {
                // ✅ 2. Fallback to simple correct/incorrect check if rubric not defined
                if (
                    question.answer &&
                    question.answer.trim() === answer.trim()
                ) {
                    score = 1;
                    dimensionImpacts['General'] = 1;
                }
            }
        }

        // ✅ 3. Update total score
        quiz.total_score += score;

        // ✅ 4. Update dimension-wise scores
        for (const [dimension, impact] of Object.entries(dimensionImpacts)) {
            const existing = quiz.dimension_scores.find(
                d => d.dimension === dimension,
            );
            if (existing) {
                existing.score += impact;
            } else {
                quiz.dimension_scores.push({ dimension, score: impact });
            }
        }

        await quiz.save();

        return {
            message: score > 0 ? '✅ Correct answer!' : '❌ Wrong answer!',
            added_score: score,
            total_score: quiz.total_score,
            dimension_scores: quiz.dimension_scores,
        };
    }
}
