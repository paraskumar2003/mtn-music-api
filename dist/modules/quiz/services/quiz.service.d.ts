import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { QuizDocument } from '../entities/quiz.schema';
import { QuestionDocument, ResponseType } from '../entities/question.schema';
import { AnswerQuestionDto } from '../dto/submit-answer.dto';
import { SubmittedQuestion, SubmittedQuestionDocument } from '../entities/submitted-question.schema';
import { AIService } from 'src/modules/ai/ai.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomLoggerService } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { MongoUsersService } from 'src/modules/users/services/mongo-user.service';
import { ReportPdfService } from './report.pdf.service';
export declare class QuizService implements OnModuleInit {
    private quizModel;
    private questionModel;
    private submittedQuestionModel;
    private readonly aiService;
    private readonly eventEmitter;
    private readonly logger;
    private readonly configService;
    private readonly userService;
    private readonly reportPdfService;
    private totalNoOfQuestionToBeAsked;
    constructor(quizModel: Model<QuizDocument>, questionModel: Model<QuestionDocument>, submittedQuestionModel: Model<SubmittedQuestion>, aiService: AIService, eventEmitter: EventEmitter2, logger: CustomLoggerService, configService: ConfigService, userService: MongoUsersService, reportPdfService: ReportPdfService);
    private readonly timerInSeconds;
    private calculateAverage;
    onModuleInit(): Promise<void>;
    initiateQuiz(user_id: string): Promise<{
        message: string;
        quiz_id: string;
        question: {
            question_id: string;
            prompt_html: string;
            image_url: string;
            audio_url: string;
            options: string[];
            dimension: string;
            level: string;
            question_type: ResponseType;
            timer_in_seconds: number;
        };
    }>;
    answerQuestion(dto: AnswerQuestionDto, user_id: string): Promise<{
        message: string;
        added_score: any;
        total_score: number;
        nextQuestion: {
            question_id: string;
            prompt_html: string;
            image_url: string;
            audio_url: string;
            options: string[];
            dimension: string;
            level: string;
            question_type: ResponseType;
            timer_in_seconds: number;
        } | {
            question_id?: undefined;
            prompt_html?: undefined;
            image_url?: undefined;
            audio_url?: undefined;
            options?: undefined;
            dimension?: undefined;
            level?: undefined;
            question_type?: undefined;
            timer_in_seconds?: undefined;
        };
        is_last_question: boolean;
        remaining_questions: number;
    }>;
    handleAiEvaluateAnswerEvent({ question, answer, submittedQuestion, }: {
        question: QuestionDocument;
        answer: string;
        submittedQuestion: SubmittedQuestionDocument;
    }): Promise<void>;
    handleQuizReport(payload: {
        quiz_id: string;
        user_id: string;
    }): Promise<void>;
}
