import { ValueProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TaskAssignationNotification,
  TaskAssignationNotificationData,
  TaskAssignedEvent,
} from '../../../domain';
import { TaskFollowersRepository } from '../../../domain/repositories';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationsRepositoryToken } from '../../../adapter/providers';
import { TaskFollowersRepositoryToken } from '../../../adapter/providers/task-followers-repository.provider';
import { CreateNewAssignationNotificationInteractor } from './create-new-assignation-notification.interactor';
import { NewNotificationEmitter } from '../../emitters/new-notification.emitter';

describe('CreateNewAssignationNotificationInteractor', () => {
  let service: CreateNewAssignationNotificationInteractor;

  const mockRepo: TaskAssignationNotificationsRepository = {
    create: async (_data: Omit<TaskAssignationNotificationData, 'id'>) => null,
    readNotification: async (_notificationId: string) => null,
    getNewNotifications: async (_userId: string) => null,
    dismissNotificationsFromTask: jest.fn(),
  };

  let notificationEmitter: NewNotificationEmitter;
  // *jest.spyOn(notificationEmitter, 'fireNewNotificationEvent').
  const mockFollowersRepo: TaskFollowersRepository = {
    getTaskFollowersIds: jest.fn(),
    getTasksFollowedByUser: jest.fn(),
    markUserAsFollowerOfTask: jest.fn(),
  };

  const assignationNotifsRepoProvider: ValueProvider = {
    provide: TaskAssignationNotificationsRepositoryToken,
    useValue: mockRepo,
  };

  const followersRepoProvider: ValueProvider = {
    provide: TaskFollowersRepositoryToken,
    useValue: mockFollowersRepo,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNewAssignationNotificationInteractor,
        assignationNotifsRepoProvider,
        followersRepoProvider,
        NewNotificationEmitter,
      ],
    }).compile();

    notificationEmitter = module.get<NewNotificationEmitter>(
      NewNotificationEmitter,
    );

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
      assignedById: 'another-id',
      task: {
        id: 'task-id',
        title: 'task name',
      },
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
      assignedById: userId,
      task: {
        id: 'task-id',
        title: 'task name',
      },
    };

    jest.spyOn(mockRepo, 'create');

    await service.handle(taskAssigned);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it('should add the assignee as a task follower ', async () => {
    const taskAssignedEvent: TaskAssignedEvent = {
      assigneeId: 'assignee-id',
      assignedById: 'assigner-id',
      project: {
        id: 'project-id',
        name: 'project-name',
      },
      task: {
        id: 'task-id',
        title: 'task-name',
      },
    };
    await service.handle(taskAssignedEvent);

    expect(mockFollowersRepo.markUserAsFollowerOfTask).toHaveBeenCalledWith(
      taskAssignedEvent.assigneeId,
      taskAssignedEvent.task.id,
    );
  });

  it('if the user has not self-assigned a task, it should call notificationEmitter.fireNewNotificationEvent with the correctly built Notification', async () => {
    const userId = 'user-id-xyz';
    const assigneeId = 'assignee-123-abc';
    const taskAssigned: TaskAssignedEvent = {
      assigneeId: assigneeId,
      project: null,
      assignedById: userId,
      task: {
        id: 'task-id',
        title: 'task name',
      },
    };

    const newNotificationId = 'notification-id-123456';
    jest
      .spyOn(mockRepo, 'create')
      .mockImplementation(async () => newNotificationId);
    jest.spyOn(notificationEmitter, 'fireNewNotificationEvent');

    await service.handle(taskAssigned);

    const expectedNotification = new TaskAssignationNotification({
      assigneeId,
      id: newNotificationId,
      project: null,
      task: {
        id: 'task-id',
        title: 'task name',
      },
    });
    expect(notificationEmitter.fireNewNotificationEvent).toHaveBeenCalledWith(
      expectedNotification,
    );
  });
});
