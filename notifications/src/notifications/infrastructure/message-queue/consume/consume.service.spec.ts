import { Test, TestingModule } from '@nestjs/testing';
import { ConsumeService } from './consume.service';

describe('ConsumeService', () => {
  let service: ConsumeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumeService],
    }).compile();

    service = module.get<ConsumeService>(ConsumeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
