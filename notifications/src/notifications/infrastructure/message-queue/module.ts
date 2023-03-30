import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConsumeService } from './consume/consume.service';
import {
  NewCommentExchangeName,
  TaskAssignedExchangeName,
} from './exchange-names';

@Module({
  imports: [
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
      uri: 'amqp://guest:guest@localhost:5672',
    }),
  ],
  providers: [ConsumeService],
})
export class NotificationsRabbitMQModule {}
