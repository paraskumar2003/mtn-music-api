"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3MultipleFieldsInterceptor = S3MultipleFieldsInterceptor;
const platform_express_1 = require("@nestjs/platform-express");
const multerS3 = require("multer-s3");
const uuid_1 = require("uuid");
const s3_service_1 = require("../s3.service");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
dotenv.config();
function S3MultipleFieldsInterceptor(fields) {
    const s3Client = new s3_service_1.S3Service().getS3Client();
    return (0, common_1.mixin)((0, platform_express_1.FileFieldsInterceptor)(fields, {
        storage: multerS3({
            s3: s3Client,
            bucket: process.env.AWS_S3_BUCKET_NAME,
            acl: 'public-read',
            key: (req, file, cb) => {
                const ext = file.originalname.split('.').pop();
                const filename = `${(0, uuid_1.v4)()}.${ext}`;
                cb(null, `mtn+${process.env.NODE_ENV}/app/upload/${filename}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            cb(null, true);
        },
    }));
}
//# sourceMappingURL=s3.interceptor.js.map