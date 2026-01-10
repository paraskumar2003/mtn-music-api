"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const question_schema_1 = require("./entities/question.schema");
const quiz_service_1 = require("./services/quiz.service");
const quiz_controller_1 = require("./quiz.controller");
const quiz_schema_1 = require("./entities/quiz.schema");
const submitted_question_schema_1 = require("./entities/submitted-question.schema");
const ai_module_1 = require("../ai/ai.module");
const report_pdf_service_1 = require("./services/report.pdf.service");
const users_module_1 = require("../users/users.module");
let QuizModule = class QuizModule {
};
exports.QuizModule = QuizModule;
exports.QuizModule = QuizModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { schema: question_schema_1.QuestionSchema, name: question_schema_1.Question.name },
                { schema: quiz_schema_1.QuizSchema, name: quiz_schema_1.Quiz.name },
                {
                    schema: submitted_question_schema_1.SubmittedQuestionSchema,
                    name: submitted_question_schema_1.SubmittedQuestion.name,
                },
            ]),
            ai_module_1.AiModule,
            users_module_1.UsersModule,
        ],
        controllers: [quiz_controller_1.QuizController],
        providers: [quiz_service_1.QuizService, report_pdf_service_1.ReportPdfService],
        exports: [quiz_service_1.QuizService, report_pdf_service_1.ReportPdfService],
    })
], QuizModule);
//# sourceMappingURL=quiz.module.js.map