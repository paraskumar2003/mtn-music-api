export declare class NeuroprofilingMailVariablesDto {
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
export declare class SendMailDto {
    to: string | string[];
    from: string;
    cc?: string | string[];
    mailSubject: string;
    text?: string;
    htmlContent?: string;
    attachments?: Array<{
        buffer: Buffer;
        filename: string;
        mimeType?: string;
    } | string>;
}
