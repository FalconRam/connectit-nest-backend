import { Test, TestingModule } from '@nestjs/testing';
import { CreateResponseService } from './createResponse.service';

describe('CreateResponseService', () => {
  let service: CreateResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateResponseService],
    }).compile();

    service = module.get<CreateResponseService>(CreateResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
