import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class InitiateWindowDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    mobile: string;

    @Type(() => Number)
    @IsNumber()
    age: number;

    @IsString()
    @IsNotEmpty()
    role: string;
}
