import { Test, TestingModule } from '@nestjs/testing';
import { CommentNotificationRepository } from './comment-notification.repository';

describe('CommentNotificationRepository', () => {
  let service: CommentNotificationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentNotificationRepository],
    }).compile();

    service = module.get<CommentNotificationRepository>(
      CommentNotificationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
