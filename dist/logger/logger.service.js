"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLoggerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winston = require("winston");
const WinstonCloudWatch = require("winston-aws-cloudwatch");
const AWS = require("aws-sdk");
let CustomLoggerService = class CustomLoggerService {
    constructor(configService) {
        this.configService = configService;
        this.initializeLogger();
    }
    initializeLogger() {
        const env = this.configService.get('NODE_ENV', 'development');
        const logGroupName = `${this.configService.get('APP_NAME', 'APP')}_${env}`;
        this.logger = winston.createLogger({
            levels: {
                emerg: 0,
                alert: 1,
                crit: 2,
                error: 3,
                warn: 4,
                notice: 5,
                info: 6,
                debug: 7,
            },
            transports: [
                new WinstonCloudWatch({
                    cloudWatchLogs: new AWS.CloudWatchLogs(),
                    logGroupName,
                    logStreamName: 'LOGGER_MODULE',
                    createLogGroup: true,
                    createLogStream: true,
                    submissionInterval: 2000,
                    submissionRetryCount: 1,
                    batchSize: 20,
                    awsConfig: {
                        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
                        region: this.configService.get('AWS_REGION'),
                    },
                    formatLog: item => {
                        return JSON.stringify({
                            timestamp: Date.now(),
                            tag: item.level,
                            journeyId: item.meta?.journeyId || 'system',
                            data: item.meta?.data || {},
                            message: item.message,
                        });
                    },
                }),
                new winston.transports.Console({
                    format: winston.format.simple(),
                }),
            ],
        });
    }
    createLogData(tag, journeyId, data) {
        return {
            timestamp: Date.now(),
            tag,
            journeyId,
            data,
        };
    }
    log(tag, journeyId, data) {
        const logData = this.createLogData(tag, journeyId, data);
        this.logger.info(tag, { journeyId, data });
        console.log(logData);
    }
    error(tag, journeyId, data) {
        const logData = this.createLogData(tag, journeyId, data);
        this.logger.error(tag, { journeyId, data });
        console.error(logData);
    }
    warn(tag, journeyId, data) {
        const logData = this.createLogData(tag, journeyId, data);
        this.logger.warn(tag, { journeyId, data });
        console.warn(logData);
    }
    info(tag, journeyId, data) {
        const logData = this.createLogData(tag, journeyId, data);
        this.logger.info(tag, { journeyId, data });
        console.info(logData);
    }
};
exports.CustomLoggerService = CustomLoggerService;
exports.CustomLoggerService = CustomLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CustomLoggerService);
//# sourceMappingURL=logger.service.js.map