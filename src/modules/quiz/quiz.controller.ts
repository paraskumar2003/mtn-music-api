import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { CustomAuthGuard } from 'src/common/guards/block-user.guard';
import { QuizService } from './services/quiz.service';
import { AnswerQuestionDto } from './dto/submit-answer.dto';
import { Request, Response } from 'express';
import { ReportPdfService } from './services/report.pdf.service';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
        private readonly reportService: ReportPdfService,
    ) {}

    @Post('initiate')
    @UseGuards(CustomAuthGuard)
    async initiateQuiz(@Req() req: Request) {
        return this.quizService.initiateQuiz(req.user.id);
    }

    @Post('answer')
    @UseGuards(CustomAuthGuard)
    async answerQuestion(@Body() dto: AnswerQuestionDto, @Req() req: Request) {
        return this.quizService.answerQuestion(dto, req.user.id);
    }

    @Get('report/pdf')
    async downloadPdf(@Res() res: Response) {
        const pdfBuffer = await this.reportService.generatePdf({
            name: 'Paras Kumar',
            email: 'paras.kumar@example.com',
            role: 'Software Engineer',
            age_range: '22–30',
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
            department_reasoning:
                'The Visual–Strategic Thinker profile aligns well with the Software Engineering department, which values creativity and problem-solving. Data Science, on the other hand, excels in data analysis and machine learning, which complements the Visual–Strategic Thinker’s analytical skills.',
            hr_questions: [
                'Can you describe a time when you had to work with a team to solve a complex problem?',
                'What is your preferred method of communication with team members?',
                'How do you handle stress and pressure in a fast-paced work environment?',
            ],
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition':
                'attachment; filename=neuroprofiling-report.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }
}
