import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Set global prefix
    app.setGlobalPrefix('api');

    // Retrieve TransformInterceptor from Nest's DI container
    const transformInterceptor = app.get(TransformInterceptor);
    app.useGlobalInterceptors(transformInterceptor);

    // Apply global exception filter
    const exceptionFilter = app.get(AllExceptionsFilter);
    app.useGlobalFilters(exceptionFilter);

    // Enable validation pipes globally
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Enable CORS
    app.enableCors();

    const port = process.env.PORT || 3000;

    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
console.log('env', process.env.NODE_ENV);
