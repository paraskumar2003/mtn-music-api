"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const logger_module_1 = require("./logger/logger.module");
const utils_module_1 = require("./utils/utils.module");
const idempotency_module_1 = require("./idempotency/key-guard/idempotency.module");
const modules_1 = require("./modules");
const redis_module_1 = require("./redis/redis.module");
const s3_module_1 = require("./s3/s3.module");
const mongo_users_module_1 = require("./modules/mongo-users/mongo-users.module");
const mongoose_config_1 = require("./config/mongoose.config");
const app_service_1 = require("./app.service");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const exception_filter_1 = require("./common/filters/exception.filter");
const quiz_module_1 = require("./modules/quiz/quiz.module");
const ai_module_1 = require("./modules/ai/ai.module");
const jwt_strategy_1 = require("./auth/strategies/jwt.strategy");
const event_emitter_1 = require("@nestjs/event-emitter");
const serve_static_1 = require("@nestjs/serve-static");
const path = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: (() => {
                    switch (process.env.NODE_ENV) {
                        case 'production':
                            return '.env.production';
                        case 'development':
                            return '.env.development';
                        case 'local':
                            return '.env.local';
                        default:
                            return '.env';
                    }
                })(),
            }),
            logger_module_1.LoggerModule,
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: mongoose_config_1.getMongoConfig,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path.join(process.cwd(), 'public'),
                serveRoot: '/static',
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            mongo_users_module_1.MongoUsersModule,
            modules_1.UsersModule,
            quiz_module_1.QuizModule,
            ai_module_1.AiModule,
            utils_module_1.UtilsModule,
            idempotency_module_1.IdempotencyModule,
            redis_module_1.RedisModule,
            s3_module_1.S3Module,
        ],
        providers: [
            app_service_1.AppService,
            transform_interceptor_1.TransformInterceptor,
            exception_filter_1.AllExceptionsFilter,
            jwt_strategy_1.JwtStrategy,
        ],
        exports: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map