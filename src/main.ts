import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {FunctionsService} from './functions/functions.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const options = new DocumentBuilder()
        .setTitle('Enbase server')
        .setDescription('The serverless app platform')
        .setVersion('1.0')
        .addTag('enbase')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    app.get<FunctionsService>(FunctionsService);
    await app.listen(3000);
}

bootstrap();
