import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import { UtilsModule } from './utils/utils.module';
import { IdempotencyModule } from './idempotency/key-guard/idempotency.module';
import { UsersModule } from './modules';
import { RedisModule } from './redis/redis.module';
import { S3Module } from './s3/s3.module';
import { MongoUsersModule } from './modules/mongo-users/mongo-users.module';
import { getMongoConfig } from './config/mongoose.config';
import { AppService } from './app.service';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { QuizModule } from './modules/quiz/quiz.module';
import { AiModule } from './modules/ai/ai.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
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
        LoggerModule,
        // MongoDB Connection
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(process.cwd(), 'public'),
            serveRoot: '/static',
        }),
        EventEmitterModule.forRoot(),
        MongoUsersModule,
        UsersModule,
        QuizModule,
        AiModule,
        UtilsModule,
        IdempotencyModule,
        RedisModule,
        S3Module,
    ],
    providers: [
        AppService,
        TransformInterceptor,
        AllExceptionsFilter,
        JwtStrategy,
    ],
    exports: [AppService],
})
export class AppModule {}
