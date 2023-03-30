import { JwtAuthGuard } from './jwt-auth.guard';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ExecutionContext, Provider } from '@nestjs/common';
import { EnvironmentVariablesService } from '../environment/environment-variables.service';
import { createMock } from '@golevelup/ts-jest';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const envVariablesServiceProvider: Provider = {
      provide: EnvironmentVariablesService,
      useValue: {
        getJWTSecret: () => 'random-non-empty-key',
      },
    };
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule, JwtModule],
      providers: [JwtStrategy, JwtAuthGuard, envVariablesServiceProvider],
    }).compile();

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
  it('should always return true if the request comes from a RabbitMQ event', async () => {
    const rabbitMQContext = createMock<ExecutionContext>();

    jest.spyOn(guard, 'isRabbitContext').mockImplementation(() => true);
    const canActivate = await guard.canActivate(rabbitMQContext);

    expect(canActivate).toBe(true);
  });
});
