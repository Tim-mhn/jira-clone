import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { TaskAssignedExchangeName } from '../exchange-names';

@Injectable()
export class ConsumeService {
  constructor() {
    console.log('ConsumerService created');
  }
  @RabbitSubscribe({
    exchange: TaskAssignedExchangeName,
    routingKey: '',
    allowNonJsonMessages: true,
  })
  public async pubSubHandler(msg: any) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }

  @RabbitSubscribe({
    exchange: 'logs',
    routingKey: '',
    allowNonJsonMessages: true,
  })
  public async log(msg: any) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}
