import { Test, TestingModule } from '@nestjs/testing';
import { DBTaskAssignationNotificationsRepository } from './task-assignation-notifications.repository';

describe('AssignationNotificationsRepository', () => {
  let service: DBTaskAssignationNotificationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DBTaskAssignationNotificationsRepository],
    }).compile();

    service = module.get<DBTaskAssignationNotificationsRepository>(
      DBTaskAssignationNotificationsRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
