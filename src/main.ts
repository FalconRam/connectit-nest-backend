import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors();
  app.use(json({ limit: '5mb' }));
  // app.useGlobalPipes(new ValidationPipe()); // Validation based on pipe - dto
  await app.listen(5000);
}
bootstrap();
