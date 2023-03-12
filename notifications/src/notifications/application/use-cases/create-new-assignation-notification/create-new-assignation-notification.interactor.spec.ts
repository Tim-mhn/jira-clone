import { ValueProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TaskAssignationNotificationData,
  TaskAssignedEvent,
} from '../../../domain';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CreateNewAssignationNotificationInteractor } from './create-new-assignation-notification.interactor';

describe('CreateNewAssignationNotificationInteractor', () => {
  let service: CreateNewAssignationNotificationInteractor;

  const mockRepo: TaskAssignationNotificationRepository = {
    create: async (_data: Omit<TaskAssignationNotificationData, 'id'>) => null,
    readNotification: async (_notificationId: string) => null,
    getNewNotifications: async (_userId: string) => null,
  };

  const provider: ValueProvider = {
    provide: TaskAssignationNotificationRepositoryToken,
    useValue: mockRepo,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateNewAssignationNotificationInteractor, provider],
    }).compile();

    service = module.get<CreateNewAssignationNotificationInteractor>(
      CreateNewAssignationNotificationInteractor,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call mockRepo.create if the assigner id is different from assignee id', async () => {
    const taskAssigned: TaskAssignedEvent = {
      assigneeId: 'some-id',
      project: null,
      assignerId: 'another-id',
      taskId: 'task-id',
    };

    jest.spyOn(mockRepo, 'create');

    await service.handle(taskAssigned);

    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('should NOT call mockRepo.create if the user has assigned the task to himself', async () => {
    const userId = 'user-id-xyz';
    const taskAssigned: TaskAssignedEvent = {
      assigneeId: userId,
      project: null,
      assignerId: userId,
      taskId: 'task-id',
    };

    jest.spyOn(mockRepo, 'create');

    await service.handle(taskAssigned);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
