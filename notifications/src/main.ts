import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './shared/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(logger);

  await app.listen(process.env.PORT);
}
bootstrap();
