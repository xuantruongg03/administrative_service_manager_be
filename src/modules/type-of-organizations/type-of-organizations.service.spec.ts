import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfOrganizationsService } from './type-of-organizations.service';

describe('TypeOfOrganizationsService', () => {
  let service: TypeOfOrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOfOrganizationsService],
    }).compile();

    service = module.get<TypeOfOrganizationsService>(TypeOfOrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
