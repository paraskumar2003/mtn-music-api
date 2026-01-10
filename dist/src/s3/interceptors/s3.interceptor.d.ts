import { NestInterceptor, Type } from '@nestjs/common';
export declare function S3MultipleFieldsInterceptor(fields: {
    name: string;
    maxCount: number;
}[]): Type<NestInterceptor>;
