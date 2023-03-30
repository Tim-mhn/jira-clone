import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.isRabbitContext(context)) return true;

    return super.canActivate(context);
  }

  isRabbitContext(context: ExecutionContext) {
    return isRabbitContext(context);
  }
}
