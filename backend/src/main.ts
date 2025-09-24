import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3003;

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(express.json({ limit: '50mb' }));
  expressApp.use(express.urlencoded({ extended: true, limit: '50mb' }));
  expressApp.use(express.raw({ limit: '50mb' }));

  app.use(cookieParser());

  app.enableCors({
    origin: [
      configService.get('app.frontendUrlPublic'),
      configService.get('app.frontendUrlAdmin'),
      'http://localhost:3000', // Add support for Next.js dev server on port 3000
      'http://localhost:3002', // Add support for Next.js dev server on port 3002
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port ?? 3003);
  console.log(`NestJS applicaiton is running one: ${await app.getUrl()}`);
}

bootstrap();