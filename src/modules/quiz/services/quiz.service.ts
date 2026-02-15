import {
    BadRequestException,
    Injectable,
    NotFoundException,
    OnModuleInit,
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
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { MongoUsersService } from 'src/modules/users/services/mongo-user.service';
import { ReportPdfService } from './report.pdf.service';

@Injectable()
export class QuizService implements OnModuleInit {
    private totalNoOfQuestionToBeAsked: number;

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
        private readonly configService: ConfigService,
        private readonly userService: MongoUsersService,
        private readonly reportPdfService: ReportPdfService,
    ) {
        this.totalNoOfQuestionToBeAsked = +this.configService.get<number>(
            'NO_OF_QUESTIONS_TO_BE_ASKED',
        );

        if (!this.totalNoOfQuestionToBeAsked) {
            throw new Error(
                'NO_OF_QUESTIONS_TO_BE_ASKED is not defined in .env or is not a number',
            );
        }
    }

    private readonly timerInSeconds = 1 * 20;

    private calculateAverage(
        key: 'visual' | 'auditory' | 'rhythmic' | 'subconscious',
        questions: any[],
    ) {
        const total = questions.reduce(
            (acc, cur) => {
                acc.score += cur[key] ?? 0;
                acc.confidence += cur.confidence_score ?? 0;
                return acc;
            },
            { score: 0, confidence: 0 },
        );

        const count = questions.length;

        return {
            score: total.score / count,
            confidence: total.confidence / count,
        };
    }

    async onModuleInit() {
        console.log('EVENT_FIRED');
        // setTimeout(() => {
        //     this.eventEmitter.emit('quiz.report.sendMail', {
        //         quiz_id: '69628930319a138a687d1b25',
        //         user_id: '695d3908e563adf02cfef831',
        //     });
        // }, 5000);
    }

    /** 🎯 Initiate quiz — send one question to user */
    async initiateQuiz(user_id: string) {
        // Pick a random question
        const question = await this.questionModel
            .findOne({})
            .sort({ seq_no: 1 });

        if (!question) throw new NotFoundException('No questions available');

        /** if a quiz already exists for this user in the last 24 hours, throw bad request exception - 'You have already started a quiz' */
        const existingQuiz = await this.quizModel.findOne({
            user: new Types.ObjectId(user_id),
            played_at: {
                $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        });

        if (existingQuiz) {
            throw new BadRequestException(
                'You have already played a quiz. Please try again later.',
            );
        }

        const createdQuiz = await this.quizModel.create({
            user: new Types.ObjectId(user_id),
            total_questions: 1,
            total_score: 0,
        });

        // Create a submitted question entry
        await this.submittedQuestionModel.create({
            quiz: createdQuiz._id,
            question: question._id,
            user: new Types.ObjectId(user_id),
            dimension: question.dimension,
        });

        return {
            message: '✅ Quiz started successfully',
            quiz_id: createdQuiz._id.toString(),
            question: {
                question_id: question._id.toString(),
                prompt_html: question.prompt_html,
                image_url: question.image_url,
                audio_url: question.audio_url,
                options: question.options,
                dimension: question.dimension,
                level: question.level,
                question_type: question.question_type,
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
            seq_no: {
                $gt: question.seq_no,
            },
        });

        // Create a submitted question entry
        if (nextQuestion)
            await this.submittedQuestionModel.create({
                quiz: quiz._id,
                question: nextQuestion._id,
                user: new Types.ObjectId(user_id),
                dimension: nextQuestion.dimension,
            });

        /** if no. of question already asked + 1 is 15 then, mark this as last question */
        /** calculate the total number of questions in the collection */
        const totalNoOfQuestions = await this.questionModel.countDocuments();

        /** emit report-mail event */
        if (
            alreadyAskedQuestionIds.length ===
            Math.min(this.totalNoOfQuestionToBeAsked, totalNoOfQuestions)
        ) {
            setTimeout(() => {
                this.eventEmitter.emit('quiz.report.sendMail', {
                    quiz_id,
                    user_id,
                });
            }, 10000);
        }

        console.log('alreadyAskedQuestionIds', alreadyAskedQuestionIds);
        console.log(
            'totalNoOfQuestionToBeAsked',
            this.totalNoOfQuestionToBeAsked,
        );
        console.log('totalQuestions', totalNoOfQuestions);

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
            remaining_questions:
                Math.min(this.totalNoOfQuestionToBeAsked, totalNoOfQuestions) -
                alreadyAskedQuestionIds.length -
                1,
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
            aiResponse?.confidence_score || 0; 1
        submittedQuestionDoc.reason = aiResponse?.reason || '';

        submittedQuestionDoc.visual = aiResponse?.visual || 0;
        submittedQuestionDoc.auditory = aiResponse?.auditory || 0;
        submittedQuestionDoc.rhythmic = aiResponse?.rhythmic || 0;
        submittedQuestionDoc.subconscious = aiResponse?.subconscious || 0;

        submittedQuestionDoc.candidates_approach = aiResponse?.candidates_approach || '';
        submittedQuestionDoc.demonstrated_strengths = aiResponse?.demonstrated_strengths || '';
        submittedQuestionDoc.omissions_or_delays = aiResponse?.omissions_or_delays || '';
        submittedQuestionDoc.hr_interpretation = aiResponse?.hr_interpretation || '';

        submittedQuestionDoc.err_while_evaluation_by_llm =
            aiResponse?.is_error || null;

        // 4️⃣ Persist
        await submittedQuestionDoc.save();
    }

    /** handle event quiz.report.sendMail */
    @OnEvent('quiz.report.sendMail')
    async handleQuizReport(payload: { quiz_id: string; user_id: string }) {
        const journeyId = v4();

        this.logger.info('QUIZ.REPORT.SENDMAIL event received', journeyId, {
            quiz_id: payload.quiz_id,
            user_id: payload.user_id,
        });

        try {
            /** all we need is 
             * 
             * 
             * {
            name: 'Paras Kumar',
            email: 'paras.kumar@example.com',
            role: 'Software Engineer',
            age_range: '22–30',
            test_duration: 18,
            report_date: '06 Jan 2026',

            top_profile: 'Visual–Strategic Thinker',
            confidence: 'High (87%)',

            mix_visual: 42,
            mix_auditory: 18,
            mix_rhythmic: 25,
            mix_subconscious: 15,
        }
             */

            let user = await this.userService.getUserById(payload.user_id);
            let user_details = await this.userService.getUserDetailsByUserId(
                payload.user_id,
            );

            if (!user) {
                this.logger.info(
                    'USER_DETAILS_NOT_FOUND_WHILE_REPORT_GENERATION',
                    journeyId,
                    { payload },
                );
            }

            /** find all answered questions */
            let submittedQuestions = await this.submittedQuestionModel.find({
                quiz: new Types.ObjectId(payload.quiz_id),
            });

            if (!submittedQuestions || submittedQuestions.length === 0) {
                this.logger.info(
                    'NO_ANSWERED_QUESTIONS_FOUND_WHILE_REPORT_GENERATION',
                    journeyId,
                    { payload },
                );
            }

            /** find average of all four parameters */

            const visualAvg = this.calculateAverage(
                'visual',
                submittedQuestions,
            );
            const auditoryAvg = this.calculateAverage(
                'auditory',
                submittedQuestions,
            );
            const rhythmicAvg = this.calculateAverage(
                'rhythmic',
                submittedQuestions,
            );
            const subconsciousAvg = this.calculateAverage(
                'subconscious',
                submittedQuestions,
            );

            const dimensions = {
                visual: visualAvg.score,
                auditory: auditoryAvg.score,
                rhythmic: rhythmicAvg.score,
                subconscious: subconsciousAvg.score,
                confidence:
                    (visualAvg.confidence +
                        auditoryAvg.confidence +
                        rhythmicAvg.confidence +
                        subconsciousAvg.confidence) /
                    4,
            };

            /** find the department details based on the cognitive profile */

            const departmentDetails =
                await this.aiService.analyseDepartment(dimensions);

            if (departmentDetails.is_error) {
                this.logger.error(
                    'ERROR_WHILE_ANALYSING_DEPARTMENT',
                    journeyId,
                    {
                        message: departmentDetails.is_error.message,
                        dimensions,
                    },
                );
            }

            const dominantDimension = Object.entries(dimensions).reduce(
                (dominant, current) => {
                    const [key, value] = current;
                    return value > dominant.value ? { key, value } : dominant;
                },
                { key: null as string | null, value: -Infinity },
            );

            let mailVariables = {
                name: user.name,
                email: user.email,
                role: user_details.current_role ?? 'N/A',
                experience: `${user_details.work_experience ?? 'N/A'} years`,
                test_duration: submittedQuestions.length * 3,
                report_date: new Date().toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }),

                top_profile: `${dominantDimension.key?.charAt(0).toUpperCase() + dominantDimension.key?.slice(1)} Thinker`,
                confidence: `High (${Math.floor(visualAvg.confidence)}%)`,

                mix_visual: Math.floor(
                    (visualAvg.score * 100) / submittedQuestions.length,
                ),
                mix_auditory: Math.floor(
                    (auditoryAvg.score * 100) / submittedQuestions.length,
                ),
                mix_rhythmic: Math.floor(
                    (rhythmicAvg.score * 100) / submittedQuestions.length,
                ),
                mix_subconscious: Math.floor(
                    (subconsciousAvg.score * 100) / submittedQuestions.length,
                ),
                recommended_department: departmentDetails?.primary_department,
                secondary_department: departmentDetails?.secondary_department,
                department_reasoning: departmentDetails?.reasoning,
                hr_questions: departmentDetails?.hr_questions,
            };

            this.logger.info('MAIL_VARIABLES', journeyId, { mailVariables });

            await this.reportPdfService.generatePdfAndSendMail(mailVariables);
        } catch (err) {
            this.logger.error('ERROR_WHILE_SENDING_QUIZ_REPORT', journeyId, {
                message: err.message,
                quiz_id: payload.quiz_id,
                user_id: payload.user_id,
            });
        }
    }
}
