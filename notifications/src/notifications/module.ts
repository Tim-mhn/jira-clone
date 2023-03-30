import { Module } from '@nestjs/common';
import { NotificationsInteractorsProvidersModule } from './application/use-cases/providers.module';
import { NotificationsController } from './infrastructure/controllers/controller';
import { NotificationsRabbitMQModule } from './infrastructure/message-queue/module';

@Module({
  imports: [
    NotificationsRabbitMQModule,
    NotificationsInteractorsProvidersModule,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
