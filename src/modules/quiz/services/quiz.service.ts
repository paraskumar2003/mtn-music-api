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
import {
    SubmittedQuestion,
    SubmittedQuestionDocument,
} from '../entities/submitted-question.schema';
import { AIService } from 'src/modules/ai/ai.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CustomLoggerService } from 'src/logger/logger.service';

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
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: CustomLoggerService,
    ) {}

    private readonly timerInSeconds = 60 * 3;

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
                timer_in_seconds: this.timerInSeconds,
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

        /** check if this question was created 3 minutes ago or more, if not throw bad request exception - 'You must wait atleast 3 minutes to answer this question' */
        if (submittedQuestion && submittedQuestion.created_at) {
            const createdAt = submittedQuestion.created_at.getTime();
            const currentTime = Date.now();
            const timeDiff = currentTime - createdAt;
            const timeDiffInMinutes = timeDiff / (1000 * 60);

            if (timeDiffInMinutes < this.timerInSeconds / 60) {
                throw new BadRequestException(
                    'You must wait atleast 3 minutes to answer this question',
                );
            }
        }

        if (!submittedQuestion)
            throw new NotFoundException('Question not found in quiz');

        if (submittedQuestion.answered_at)
            throw new NotFoundException('Question already answered');

        const dimensionImpacts: Record<string, number> = {};

        // ✅ 1. Check rubric-based scoring
        if (question.question_type === ResponseType.MCQ) {
            if (Array.isArray(question.rubric) && question.rubric.length > 0) {
                // Find matching rubric rule(s)
                for (const rule of question.rubric) {
                    if (rule.options.includes(answer)) {
                        // score += rule.score;

                        // Update dimension-wise score map
                        if (!dimensionImpacts[rule.dimension]) {
                            dimensionImpacts[rule.dimension] = 0;
                        }
                        dimensionImpacts[rule.dimension] += rule.score;
                    }
                }
            } else {
                // ✅ 2. Fallback to simple correct/incorrect check if rubric not defined
            }
        } else {
            // ✅ 3. Fallback to ai answer from ai service

            /** instead of api call, use event emitter to process just it time but non-blocking */
            this.eventEmitter.emit('ai.evaluateAnswer', {
                question,
                answer,
                submittedQuestion,
            });
        }

        // ✅ 3. Update total score
        // quiz.total_score += score;

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

        submittedQuestion.dimension = question.dimension;
        submittedQuestion.answered_at = new Date();

        await submittedQuestion.save();
        await quiz.save();

        /** find all submittedquestions for this quiz */
        const submittedQuestions = await this.submittedQuestionModel.find({
            quiz: new Types.ObjectId(quiz_id),
        });

        let alreadyAskedQuestionIds = submittedQuestions.map(q =>
            q.question._id.toString(),
        );

        let nextQuestion = await this.questionModel.findOne({
            _id: {
                $nin: alreadyAskedQuestionIds,
            },
        });

        return {
            message: 'Answer Submitted',
            added_score: null,
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
                      timer_in_seconds: this.timerInSeconds,
                  }
                : {},
            is_last_question: !!!nextQuestion,
            remaining_questions: 15 - alreadyAskedQuestionIds.length,
        };
    }

    @OnEvent('ai.evaluateAnswer')
    async handleAiEvaluateAnswerEvent({
        question,
        answer,
        submittedQuestion,
    }: {
        question: QuestionDocument;
        answer: string;
        submittedQuestion: SubmittedQuestionDocument; // contains _id
    }) {
        // 1️⃣ Fetch the latest submitted question from DB
        const submittedQuestionDoc = await this.submittedQuestionModel.findById(
            submittedQuestion._id,
        );

        if (!submittedQuestionDoc) {
            this.logger.error(
                'SUBMITTED_QUESTION_NOT_FOUND',
                submittedQuestion._id.toString(),
                {
                    submittedQuestionId: submittedQuestion._id,
                },
            );
            return;
        }

        // 2️⃣ Call AI evaluation
        const aiResponse = await this.aiService.analyseAnswer(question, answer);

        const score = aiResponse?.is_correct ? 1 : 0;

        // 3️⃣ Update fields
        submittedQuestionDoc.score = score;
        submittedQuestionDoc.is_correct = score > 0;

        submittedQuestionDoc.is_evaluated_by_llm = true;
        submittedQuestionDoc.confidence_score =
            aiResponse?.confidence_score || 0;
        submittedQuestionDoc.reason = aiResponse?.reason || '';

        submittedQuestionDoc.visual = aiResponse?.visual || 0;
        submittedQuestionDoc.auditory = aiResponse?.auditory || 0;
        submittedQuestionDoc.rhythmic = aiResponse?.rhythmic || 0;
        submittedQuestionDoc.subconscious = aiResponse?.subconscious || 0;

        submittedQuestionDoc.err_while_evaluation_by_llm =
            aiResponse?.is_error || null;

        // 4️⃣ Persist
        await submittedQuestionDoc.save();
    }
}
