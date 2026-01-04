import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/question.schema';
import { QuizService } from './services/quiz.service';
import { QuizController } from './quiz.controller';
import { Quiz, QuizSchema } from './entities/quiz.schema';
import {
    SubmittedQuestion,
    SubmittedQuestionSchema,
} from './entities/submitted-question.schema';
import { AiModule } from '../ai/ai.module';
import { ReportPdfService } from './services/report.pdf.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { schema: QuestionSchema, name: Question.name },
            { schema: QuizSchema, name: Quiz.name },
            {
                schema: SubmittedQuestionSchema,
                name: SubmittedQuestion.name,
            },
        ]),
        AiModule,
        UsersModule,
    ],
    controllers: [QuizController],
    providers: [QuizService, ReportPdfService],
    exports: [QuizService, ReportPdfService],
})
export class QuizModule {}
