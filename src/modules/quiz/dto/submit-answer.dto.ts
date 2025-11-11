import { IsMongoId, IsString } from 'class-validator';

export class AnswerQuestionDto {
    @IsMongoId()
    quiz_id: string;

    @IsMongoId()
    question_id: string;

    @IsString()
    answer: string;
}
