import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz, QuizDocument } from '../entities/quiz.schema';
import {
    Question,
    QuestionDocument,
    ResponseType,
} from '../entities/question.schema';
import { AnswerQuestionDto } from '../dto/submit-answer.dto';
import { SubmittedQuestion } from '../entities/submitted-question.schema';
import { AIService } from 'src/modules/ai/ai.service';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name)
        private quizModel: Model<QuizDocument>,
        @InjectModel(Question.name)
        private questionModel: Model<QuestionDocument>,
        @InjectModel(SubmittedQuestion.name)
        private submittedQuestionModel: Model<SubmittedQuestion>,
        private readonly aiService: AIService,
    ) {}

    /** 🎯 Initiate quiz — send one question to user */
    async initiateQuiz(user_id: string) {
        // Pick a random question
        const question = await this.questionModel.aggregate([
            { $sample: { size: 1 } },
        ]);

        if (!question.length)
            throw new NotFoundException('No questions available');

        const createdQuiz = await this.quizModel.create({
            user: new Types.ObjectId(user_id),
            total_questions: 1,
            total_score: 0,
        });

        // Create a submitted question entry
        await this.submittedQuestionModel.create({
            quiz: createdQuiz._id,
            question: question[0]._id,
            user: new Types.ObjectId(user_id),
            dimension: question[0].dimension,
        });

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
            },
        };
    }

    /** 🧠 Answer API — validate answer and update score dimension-wise */
    async answerQuestion(dto: AnswerQuestionDto, user_id: string) {
        const { quiz_id, question_id, answer } = dto;

        const quiz = await this.quizModel.findById(quiz_id);
        if (!quiz) throw new NotFoundException('Quiz not found');

        const question = await this.questionModel.findById(question_id);
        if (!question) throw new NotFoundException('Question not found');

        const submittedQuestion = await this.submittedQuestionModel.findOne({
            quiz: new Types.ObjectId(quiz_id),
            question: new Types.ObjectId(question_id),
            user: new Types.ObjectId(user_id),
        });

        if (!submittedQuestion)
            throw new NotFoundException('Question not found in quiz');

        if (submittedQuestion.answered_at)
            throw new NotFoundException('Question already answered');

        // Initialize scores
        let score = 0;
        let is_evaluated_by_llm = false;
        let confidence_score = 0;
        let reason = '';
        const dimensionImpacts: Record<string, number> = {};

        // ✅ 1. Check rubric-based scoring
        if (question.question_type === ResponseType.MCQ) {
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
                score = 1;
            }
        } else {
            // ✅ 3. Fallback to ai answer from ai service
            const aiResponse = await this.aiService.analyseAnswer(
                question,
                answer,
            );

            score = aiResponse?.is_correct ? 1 : 0;
            is_evaluated_by_llm = true;
            confidence_score = aiResponse?.confidence_score || 0;
            reason = aiResponse?.reason || '';
            submittedQuestion.err_while_evaluation_by_llm =
                aiResponse?.is_error || null;
        }

        // ✅ 3. Update total score
        quiz.total_score += score;

        //  4. Update submittted question
        if (
            [ResponseType.MCQ, ResponseType.TEXT].includes(
                question.question_type,
            )
        ) {
            submittedQuestion.response_text = answer;
        }

        if (question.question_type === ResponseType.AUDIO) {
            submittedQuestion.response_audio_url = answer;
        }

        if (question.question_type === ResponseType.IMAGE) {
            submittedQuestion.response_image_url = answer;
        }

        submittedQuestion.score = score;
        submittedQuestion.answered_at = new Date();
        submittedQuestion.is_correct = score > 0;
        submittedQuestion.dimension = question.dimension;

        /** Update LLM evaluation details */
        submittedQuestion.is_evaluated_by_llm = is_evaluated_by_llm;
        submittedQuestion.confidence_score = confidence_score;
        submittedQuestion.reason = reason;

        await submittedQuestion.save();
        await quiz.save();

        let nextQuestion = await this.questionModel.findOne({
            _id: { $ne: question_id },
        });

        return {
            message: score > 0 ? '✅ Correct answer!' : '❌ Wrong answer!',
            added_score: score,
            total_score: quiz.total_score,
            nextQuestion: nextQuestion
                ? {
                      question_id: nextQuestion._id.toString(),
                      prompt_html: nextQuestion.prompt_html,
                      image_url: nextQuestion.image_url,
                      audio_url: nextQuestion.audio_url,
                      options: nextQuestion.options,
                      dimension: nextQuestion.dimension,
                      level: nextQuestion.level,
                      question_type: nextQuestion.question_type,
                  }
                : {},
            is_last_question: !!!nextQuestion,
        };
    }
}
