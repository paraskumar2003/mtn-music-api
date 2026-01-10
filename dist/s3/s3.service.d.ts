import { S3Client } from '@aws-sdk/client-s3';
export declare class S3Service {
    private readonly s3;
    constructor();
    getS3Client(): S3Client;
}
