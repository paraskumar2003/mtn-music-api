import { CustomLoggerService } from 'src/logger/logger.service';
import { QuestionDocument } from '../quiz/entities/question.schema';
import { v4 } from 'uuid';

export class AIService {
    constructor(private readonly logger: CustomLoggerService) {}

    async analyseAnswer(
        question: QuestionDocument,
        file_url: string,
    ): Promise<{
        confidence_score: number;
        reason: string;
        is_correct: boolean;
        is_error?: any;
    }> {
        const journeyId = v4();
        try {
            return {
                confidence_score: 0.8,
                reason: 'Answer is correct',
                is_correct: true,
            };
        } catch (err) {
            this.logger.error('ERROR_WHILE_ANALYSING_ANSWER', journeyId, {
                question_id: question._id.toString(),
                file_url,
                error: err.message,
                stack: err.stack,
            });

            return {
                is_correct: false,
                is_error: err,
                confidence_score: 0,
                reason: err.message,
            };
        }
    }
}
