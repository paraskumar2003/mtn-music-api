import { CustomLoggerService } from 'src/logger/logger.service';
import { QuestionDocument } from '../quiz/entities/question.schema';
export declare class AIService {
    private readonly logger;
    constructor(logger: CustomLoggerService);
    analyseAnswer(question: QuestionDocument, file_url: string): Promise<{
        confidence_score: number;
        reason: string;
        is_correct: boolean;
        is_error?: any;
        visual: number;
        auditory: number;
        rhythmic: number;
        subconscious: number;
        candidates_approach: string;
        demonstrated_strengths: string;
        omissions_or_delays: string;
        hr_interpretation: string;
    }>;
    analyseDepartment(cognitiveProfile: {
        visual: number;
        auditory: number;
        rhythmic: number;
        subconscious: number;
        confidence: number;
    }): Promise<{
        primary_department: string;
        secondary_department: string;
        reasoning: string;
        hr_questions: string[];
        is_error?: any;
    }>;
}
