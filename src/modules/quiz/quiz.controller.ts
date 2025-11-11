import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CustomAuthGuard } from 'src/common/guards/block-user.guard';
import { QuizService } from './services/quiz.service';
import { AnswerQuestionDto } from './dto/submit-answer.dto';
import { Request } from 'express';

@Controller('quiz')
@UseGuards(CustomAuthGuard)
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Post('initiate')
    async initiateQuiz(@Req() req: Request) {
        return this.quizService.initiateQuiz(req.user.id);
    }

    @Post('answer')
    async answerQuestion(@Body() dto: AnswerQuestionDto) {
        return this.quizService.answerQuestion(dto);
    }
}
