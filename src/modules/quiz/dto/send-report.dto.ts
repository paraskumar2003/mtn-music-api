import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class NeuroprofilingMailVariablesDto {
    name: string;
    email: string;
    role: string;
    age_range: string;
    test_duration: number;
    report_date: string;
    top_profile: string;
    confidence: string;
    mix_visual: number;
    mix_auditory: number;
    mix_rhythmic: number;
    mix_subconscious: number;
}

export class SendMailDto {
    /* ---------- Recipients ---------- */

    @IsEmail({}, { each: true })
    to: string | string[];

    @IsEmail()
    from: string;

    @IsOptional()
    @IsEmail({}, { each: true })
    cc?: string | string[];

    /* ---------- Mail Content ---------- */

    @IsString()
    @IsNotEmpty()
    mailSubject: string;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsString()
    htmlContent?: string;

    /* ---------- Attachments ---------- */

    /**
     * Supports:
     * - { buffer: Buffer; filename: string; mimeType?: string }
     * - string (URL)
     */
    @IsOptional()
    @IsArray()
    attachments?: Array<
        | {
              buffer: Buffer;
              filename: string;
              mimeType?: string;
          }
        | string
    >;
}
