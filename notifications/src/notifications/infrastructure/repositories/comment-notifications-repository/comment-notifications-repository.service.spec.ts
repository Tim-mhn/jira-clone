import { Test, TestingModule } from '@nestjs/testing';
import { CommentNotificationsRepositoryService } from './comment-notifications-repository.service';

describe('CommentNotificationsRepositoryService', () => {
  let service: CommentNotificationsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentNotificationsRepositoryService],
    }).compile();

    service = module.get<CommentNotificationsRepositoryService>(CommentNotificationsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
