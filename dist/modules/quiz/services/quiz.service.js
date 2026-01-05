"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const quiz_schema_1 = require("../entities/quiz.schema");
const question_schema_1 = require("../entities/question.schema");
const submitted_question_schema_1 = require("../entities/submitted-question.schema");
const ai_service_1 = require("../../ai/ai.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const logger_service_1 = require("../../../logger/logger.service");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const mongo_user_service_1 = require("../../users/services/mongo-user.service");
const report_pdf_service_1 = require("./report.pdf.service");
let QuizService = class QuizService {
    constructor(quizModel, questionModel, submittedQuestionModel, aiService, eventEmitter, logger, configService, userService, reportPdfService) {
        this.quizModel = quizModel;
        this.questionModel = questionModel;
        this.submittedQuestionModel = submittedQuestionModel;
        this.aiService = aiService;
        this.eventEmitter = eventEmitter;
        this.logger = logger;
        this.configService = configService;
        this.userService = userService;
        this.reportPdfService = reportPdfService;
        this.timerInSeconds = 60 * 3;
        this.totalNoOfQuestionToBeAsked = +this.configService.get('NO_OF_QUESTIONS_TO_BE_ASKED');
        if (!this.totalNoOfQuestionToBeAsked) {
            throw new Error('NO_OF_QUESTIONS_TO_BE_ASKED is not defined in .env or is not a number');
        }
    }
    calculateAverage(key, questions) {
        const total = questions.reduce((acc, cur) => {
            acc.score += cur[key];
            acc.confidence += cur.confidence_score;
            return acc;
        }, { score: 0, confidence: 0 });
        const count = questions.length;
        return {
            score: total.score / count,
            confidence: total.confidence / count,
        };
    }
    async onModuleInit() {
        console.log('EVENT_FIRED');
    }
    async initiateQuiz(user_id) {
        const question = await this.questionModel.aggregate([
            { $sample: { size: 1 } },
        ]);
        if (!question.length)
            throw new common_1.NotFoundException('No questions available');
        const createdQuiz = await this.quizModel.create({
            user: new mongoose_2.Types.ObjectId(user_id),
            total_questions: 1,
            total_score: 0,
        });
        await this.submittedQuestionModel.create({
            quiz: createdQuiz._id,
            question: question[0]._id,
            user: new mongoose_2.Types.ObjectId(user_id),
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
    async answerQuestion(dto, user_id) {
        const { quiz_id, question_id, answer } = dto;
        const quiz = await this.quizModel.findById(quiz_id);
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        const question = await this.questionModel.findById(question_id);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const submittedQuestion = await this.submittedQuestionModel.findOne({
            quiz: new mongoose_2.Types.ObjectId(quiz_id),
            question: new mongoose_2.Types.ObjectId(question_id),
            user: new mongoose_2.Types.ObjectId(user_id),
        });
        if (submittedQuestion && submittedQuestion.created_at) {
            const createdAt = submittedQuestion.created_at.getTime();
            const currentTime = Date.now();
            const timeDiff = currentTime - createdAt;
            const timeDiffInMinutes = timeDiff / (1000 * 60);
            if (timeDiffInMinutes < this.timerInSeconds / 60) {
                throw new common_1.BadRequestException('You must wait atleast 3 minutes to answer this question');
            }
        }
        if (!submittedQuestion)
            throw new common_1.NotFoundException('Question not found in quiz');
        if (submittedQuestion.answered_at)
            throw new common_1.NotFoundException('Question already answered');
        const dimensionImpacts = {};
        if (question.question_type === question_schema_1.ResponseType.MCQ) {
            if (Array.isArray(question.rubric) && question.rubric.length > 0) {
                for (const rule of question.rubric) {
                    if (rule.options.includes(answer)) {
                        if (!dimensionImpacts[rule.dimension]) {
                            dimensionImpacts[rule.dimension] = 0;
                        }
                        dimensionImpacts[rule.dimension] += rule.score;
                    }
                }
            }
            else {
            }
        }
        else {
            this.eventEmitter.emit('ai.evaluateAnswer', {
                question,
                answer,
                submittedQuestion,
            });
        }
        if ([question_schema_1.ResponseType.MCQ, question_schema_1.ResponseType.TEXT].includes(question.question_type)) {
            submittedQuestion.response_text = answer;
        }
        if (question.question_type === question_schema_1.ResponseType.AUDIO) {
            submittedQuestion.response_audio_url = answer;
        }
        if (question.question_type === question_schema_1.ResponseType.IMAGE) {
            submittedQuestion.response_image_url = answer;
        }
        submittedQuestion.dimension = question.dimension;
        submittedQuestion.answered_at = new Date();
        await submittedQuestion.save();
        await quiz.save();
        const submittedQuestions = await this.submittedQuestionModel.find({
            quiz: new mongoose_2.Types.ObjectId(quiz_id),
        });
        let alreadyAskedQuestionIds = submittedQuestions.map(q => q.question._id.toString());
        let nextQuestion = await this.questionModel.findOne({
            _id: {
                $nin: alreadyAskedQuestionIds,
            },
        });
        if (nextQuestion)
            await this.submittedQuestionModel.create({
                quiz: quiz._id,
                question: nextQuestion._id,
                user: new mongoose_2.Types.ObjectId(user_id),
                dimension: nextQuestion.dimension,
            });
        if (alreadyAskedQuestionIds.length + 1 ===
            this.totalNoOfQuestionToBeAsked) {
            this.eventEmitter.emit('quiz.report.sendMail', {
                quiz_id,
                user_id,
            });
        }
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
            remaining_questions: this.totalNoOfQuestionToBeAsked -
                alreadyAskedQuestionIds.length -
                1,
        };
    }
    async handleAiEvaluateAnswerEvent({ question, answer, submittedQuestion, }) {
        const submittedQuestionDoc = await this.submittedQuestionModel.findById(submittedQuestion._id);
        if (!submittedQuestionDoc) {
            this.logger.error('SUBMITTED_QUESTION_NOT_FOUND', submittedQuestion._id.toString(), {
                submittedQuestionId: submittedQuestion._id,
            });
            return;
        }
        const aiResponse = await this.aiService.analyseAnswer(question, answer);
        const score = aiResponse?.is_correct ? 1 : 0;
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
        await submittedQuestionDoc.save();
    }
    async handleQuizReport(payload) {
        const journeyId = (0, uuid_1.v4)();
        this.logger.info('QUIZ.REPORT.SENDMAIL event received', journeyId, {
            quiz_id: payload.quiz_id,
            user_id: payload.user_id,
        });
        try {
            let user = await this.userService.getUserDetailsByUserId(payload.user_id);
            if (!user) {
                this.logger.info('USER_DETAILS_NOT_FOUND_WHILE_REPORT_GENERATION', journeyId, { payload });
            }
            let submittedQuestions = await this.submittedQuestionModel.find({
                quiz: new mongoose_2.Types.ObjectId(payload.quiz_id),
            });
            if (!submittedQuestions || submittedQuestions.length === 0) {
                this.logger.info('NO_ANSWERED_QUESTIONS_FOUND_WHILE_REPORT_GENERATION', journeyId, { payload });
            }
            const visualAvg = this.calculateAverage('visual', submittedQuestions);
            const auditoryAvg = this.calculateAverage('auditory', submittedQuestions);
            const rhythmicAvg = this.calculateAverage('rhythmic', submittedQuestions);
            const subconsciousAvg = this.calculateAverage('subconscious', submittedQuestions);
            const dimensions = {
                visual: visualAvg.score,
                auditory: auditoryAvg.score,
                rhythmic: rhythmicAvg.score,
                subconscious: subconsciousAvg.score,
            };
            const dominantDimension = Object.entries(dimensions).reduce((dominant, current) => {
                const [key, value] = current;
                return value > dominant.value ? { key, value } : dominant;
            }, { key: null, value: -Infinity });
            let mailVariables = {
                name: user.name,
                email: user.email,
                role: user.working_role,
                age_range: user.age,
                test_duration: submittedQuestions.length * 3,
                report_date: new Date().toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }),
                top_profile: `${dominantDimension.key?.charAt(0).toUpperCase() + dominantDimension.key?.slice(1)} Thinker`,
                confidence: `High (${visualAvg.confidence}%)`,
                mix_visual: (visualAvg.score * 100) / submittedQuestions.length,
                mix_auditory: (auditoryAvg.score * 100) / submittedQuestions.length,
                mix_rhythmic: (rhythmicAvg.score * 100) / submittedQuestions.length,
                mix_subconscious: (subconsciousAvg.score * 100) / submittedQuestions.length,
            };
            await this.reportPdfService.generatePdfAndSendMail(mailVariables);
        }
        catch (err) {
            this.logger.error('ERROR_WHILE_SENDING_QUIZ_REPORT', journeyId, {
                message: err.message,
                quiz_id: payload.quiz_id,
                user_id: payload.user_id,
            });
        }
    }
};
exports.QuizService = QuizService;
__decorate([
    (0, event_emitter_1.OnEvent)('ai.evaluateAnswer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizService.prototype, "handleAiEvaluateAnswerEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('quiz.report.sendMail'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizService.prototype, "handleQuizReport", null);
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(quiz_schema_1.Quiz.name)),
    __param(1, (0, mongoose_1.InjectModel)(question_schema_1.Question.name)),
    __param(2, (0, mongoose_1.InjectModel)(submitted_question_schema_1.SubmittedQuestion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        ai_service_1.AIService,
        event_emitter_1.EventEmitter2,
        logger_service_1.CustomLoggerService,
        config_1.ConfigService,
        mongo_user_service_1.MongoUsersService,
        report_pdf_service_1.ReportPdfService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map