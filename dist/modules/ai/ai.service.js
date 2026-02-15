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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const logger_service_1 = require("../../logger/logger.service");
const question_schema_1 = require("../quiz/entities/question.schema");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let AIService = class AIService {
    constructor(logger) {
        this.logger = logger;
    }
    async analyseAnswer(question, file_url) {
        const journeyId = (0, uuid_1.v4)();
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
                    response_file_url: question.question_type !== question_schema_1.ResponseType.TEXT
                        ? file_url
                        : '',
                    response_text: question.question_type === question_schema_1.ResponseType.TEXT
                        ? file_url
                        : '',
                },
            },
        };
        try {
            const res = await axios_1.default.post(config.url, config.body, {
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
                candidates_approach: result.candidates_approach,
                demonstrated_strengths: result.demonstrated_strengths,
                omissions_or_delays: result.omissions_or_delays,
                hr_interpretation: result.hr_interpretation,
            };
        }
        catch (err) {
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
                candidates_approach: '',
                demonstrated_strengths: '',
                omissions_or_delays: '',
                hr_interpretation: '',
            };
        }
    }
    async analyseDepartment(cognitiveProfile) {
        const journeyId = (0, uuid_1.v4)();
        const config = {
            url: 'http://65.1.91.197:8000/api/py/assessment/department',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                cognitive_profile: cognitiveProfile,
            },
        };
        try {
            const res = await axios_1.default.post(config.url, config.body, {
                headers: config.headers,
            });
            this.logger.info('DEPARTMENT_ASSESSMENT_SUCCESS', journeyId, {
                result: res.data,
                profile: cognitiveProfile,
            });
            const result = res.data;
            return {
                primary_department: result.primary_department,
                secondary_department: result.secondary_department,
                reasoning: result.reasoning,
                hr_questions: Array.isArray(result.hr_questions)
                    ? result.hr_questions
                    : [],
            };
        }
        catch (err) {
            this.logger.error('ERROR_WHILE_ANALYSING_DEPARTMENT', journeyId, {
                cognitive_profile: cognitiveProfile,
                error: err.message,
                stack: err.stack,
            });
            return {
                primary_department: 'Unknown',
                secondary_department: '',
                reasoning: 'Unable to determine department due to temporary evaluation error.',
                hr_questions: [],
                is_error: err.message,
            };
        }
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.CustomLoggerService])
], AIService);
//# sourceMappingURL=ai.service.js.map