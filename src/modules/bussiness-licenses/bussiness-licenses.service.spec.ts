import { Test, TestingModule } from '@nestjs/testing';
import { BussinessLicensesService } from './bussiness-licenses.service';

describe('BussinessLicensesService', () => {
  let service: BussinessLicensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BussinessLicensesService],
    }).compile();

    service = module.get<BussinessLicensesService>(BussinessLicensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
