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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const block_user_guard_1 = require("../../common/guards/block-user.guard");
const quiz_service_1 = require("./services/quiz.service");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
const report_pdf_service_1 = require("./services/report.pdf.service");
let QuizController = class QuizController {
    constructor(quizService, reportService) {
        this.quizService = quizService;
        this.reportService = reportService;
    }
    async initiateQuiz(req) {
        return this.quizService.initiateQuiz(req.user.id);
    }
    async answerQuestion(dto, req) {
        return this.quizService.answerQuestion(dto, req.user.id);
    }
    async downloadPdf(res) {
        const pdfBuffer = await this.reportService.generatePdf({
            name: 'Paras Kumar',
            email: 'paras.kumar@example.com',
            role: 'Software Engineer',
            experience: '2 years',
            test_duration: 18,
            report_date: '06 Jan 2026',
            top_profile: 'Visual–Strategic Thinker',
            confidence: 'High (87%)',
            mix_visual: 42,
            mix_auditory: 18,
            mix_rhythmic: 25,
            mix_subconscious: 15,
            recommended_department: 'Software Engineering',
            secondary_department: 'Data Science',
            department_reasoning: 'The Visual–Strategic Thinker profile aligns well with the Software Engineering department, which values creativity and problem-solving. Data Science, on the other hand, excels in data analysis and machine learning, which complements the Visual–Strategic Thinker’s analytical skills.',
            hr_questions: [
                'Can you describe a time when you had to work with a team to solve a complex problem?',
                'What is your preferred method of communication with team members?',
                'How do you handle stress and pressure in a fast-paced work environment?',
            ],
        });
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=neuroprofiling-report.pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.end(pdfBuffer);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.UseGuards)(block_user_guard_1.CustomAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "initiateQuiz", null);
__decorate([
    (0, common_1.Post)('answer'),
    (0, common_1.UseGuards)(block_user_guard_1.CustomAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submit_answer_dto_1.AnswerQuestionDto, Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "answerQuestion", null);
__decorate([
    (0, common_1.Get)('report/pdf'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "downloadPdf", null);
exports.QuizController = QuizController = __decorate([
    (0, common_1.Controller)('quiz'),
    __metadata("design:paramtypes", [quiz_service_1.QuizService,
        report_pdf_service_1.ReportPdfService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map