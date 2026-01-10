import { QuizService } from './services/quiz.service';
import { AnswerQuestionDto } from './dto/submit-answer.dto';
import { Request, Response } from 'express';
import { ReportPdfService } from './services/report.pdf.service';
export declare class QuizController {
    private readonly quizService;
    private readonly reportService;
    constructor(quizService: QuizService, reportService: ReportPdfService);
    initiateQuiz(req: Request): Promise<{
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
            question_type: import("./entities/question.schema").ResponseType;
            timer_in_seconds: number;
        };
    }>;
    answerQuestion(dto: AnswerQuestionDto, req: Request): Promise<{
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
            question_type: import("./entities/question.schema").ResponseType;
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
    downloadPdf(res: Response): Promise<void>;
}
