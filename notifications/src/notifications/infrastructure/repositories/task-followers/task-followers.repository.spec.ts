import { Test, TestingModule } from '@nestjs/testing';
import { DBTaskFollowersRepository } from './task-followers.repository';

describe('TaskFollowersRepository', () => {
  let service: DBTaskFollowersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DBTaskFollowersRepository],
    }).compile();

    service = module.get<DBTaskFollowersRepository>(DBTaskFollowersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
