import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    IsDate,
    IsBoolean,
    IsOptional,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    name: string;

    @IsNotEmpty({ message: 'Date of Birth is required' })
    @Type(() => Date)
    @IsDate({ message: 'Invalid date format' })
    dateOfBirth: Date;

    @IsNotEmpty({ message: 'Gender is required' })
    @IsString()
    gender: string;

    @IsNotEmpty({ message: 'Education Level is required' })
    educationLevel: string;

    @IsNotEmpty({ message: 'Current Role/Area of Study is required' })
    @IsString()
    @MinLength(2, { message: 'Current Role must be at least 2 characters' })
    currentRole: string;

    @IsOptional()
    @IsString()
    organization?: string;

    @IsNotEmpty({ message: 'Purpose of Assessment is required' })
    @IsString()
    assessmentPurpose: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsOptional()
    @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be 10 digits' })
    mobile?: string;

    @IsOptional()
    workExperience?: string;

    @IsNotEmpty({ message: 'Prior tests information is required' })
    @IsBoolean({ message: 'Prior tests must be either true or false' })
    priorTests: boolean;
}
