import { CustomLoggerService } from 'src/logger/logger.service';
import {
    QuestionDocument,
    ResponseType,
} from '../quiz/entities/question.schema';
import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
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
        visual: number;
        auditory: number;
        rhythmic: number;
        subconscious: number;
    }> {
        const journeyId = v4();

        let config = {
            url: 'http://65.1.91.197:8000/api/py/question',
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
                    response_file_url:
                        question.question_type !== ResponseType.TEXT
                            ? file_url
                            : '',
                    response_text:
                        question.question_type === ResponseType.TEXT
                            ? file_url
                            : '',
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
                confidence_score: Math.floor(result.confidence * 100),
                reason: result.reason,
                is_correct: result.is_correct,
                visual: result.visual,
                auditory: result.auditory,
                rhythmic: result.rhythmic,
                subconscious: result.subconscious,
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
                confidence_score: 0.6,
                reason: '',
                is_correct: false,
                visual: 8,
                auditory: 7,
                rhythmic: 6,
                subconscious: 5,
            };
        }
    }
}
