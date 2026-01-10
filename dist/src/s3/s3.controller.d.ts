import { S3MulterFile } from './interfaces/s3.interface';
export declare class S3Controller {
    uploadSingleImage(files: {
        file?: S3MulterFile[];
    }): Promise<{
        url: string;
    }>;
}
