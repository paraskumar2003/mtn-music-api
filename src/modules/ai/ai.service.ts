import { CustomLoggerService } from 'src/logger/logger.service';
import { QuestionDocument } from '../quiz/entities/question.schema';
import { v4 } from 'uuid';
import axios from 'axios';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AIService implements OnModuleInit {
    constructor(private readonly logger: CustomLoggerService) {}

    onModuleInit() {
        this.logger.info('AI_SERVICE_INITIALIZED', String(Date.now()), {});
    }

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

        let config = {
            url: 'http://13.232.220.47/api/py/question',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                question: {
                    dimension: question.dimension,
                    level: question.level,
                    type: question.question_type,
                    prompt_html: question.prompt_html,
                    image_url: question.image_url,
                    audio_url: question.audio_url,
                    options: question.options,
                    response_type: question.question_type,
                    response_file_url: file_url,
                    response_text: question.answer,
                },
            },
        };

        try {
            const res = await axios.post(config.url, config.body, {
                headers: config.headers,
            });

            this.logger.info('ANALYSING_ANSWER_SUCCESS', journeyId, {
                result: res.data,
                config,
            });

            let result = res.data;

            return {
                confidence_score: result.confidence,
                reason: result.reason,
                is_correct: result.is_correct,
            };
        } catch (err) {
            this.logger.error('ERROR_WHILE_ANALYSING_ANSWER', journeyId, {
                question_id: question._id.toString(),
                file_url,
                error: err.message,
                stack: err.stack,
                payload: config.body,
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
