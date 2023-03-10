import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './shared/logger/logger.middleware';

//todo:
// 1. implement TaskAssignation Notification
// 2. Think about using Actual DB : Relational ? NoSQL ? ORM: TypeORM vs Prisma ?

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(logger);
  await app.listen(3000);
}
bootstrap();
