import { Test, TestingModule } from '@nestjs/testing';
import { GetNewNotificationsInteractor } from './get-new-notifications.interactor';

describe('GetNewNotificationsInteractor', () => {
  let service: GetNewNotificationsInteractor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetNewNotificationsInteractor],
    }).compile();

    service = module.get<GetNewNotificationsInteractor>(
      GetNewNotificationsInteractor,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
