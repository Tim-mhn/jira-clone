import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { NotificationsInteractorsProvidersModule } from '../../application/use-cases/providers.module';
import {
  NewCommentExchangeName,
  TaskAssignedExchangeName,
} from './exchange-names';
import { TasksEventsSubscriber } from './task-events.subscriber';

@Module({
  imports: [
    NotificationsInteractorsProvidersModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: TaskAssignedExchangeName,
          type: 'fanout',
        },

        {
          name: 'logs',
          type: 'fanout',
        },
        {
          name: NewCommentExchangeName,
          type: 'fanout',
        },
      ],
      uri: process.env.RABBIT_MQ_URI,
    }),
  ],
  providers: [TasksEventsSubscriber],
})
export class NotificationsRabbitMQModule {}
