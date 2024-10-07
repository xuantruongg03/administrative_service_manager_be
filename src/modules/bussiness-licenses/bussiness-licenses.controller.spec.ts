import { Test, TestingModule } from '@nestjs/testing';
import { BussinessLicensesController } from './bussiness-licenses.controller';
import { BussinessLicensesService } from './bussiness-licenses.service';

describe('BussinessLicensesController', () => {
  let controller: BussinessLicensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BussinessLicensesController],
      providers: [BussinessLicensesService],
    }).compile();

    controller = module.get<BussinessLicensesController>(BussinessLicensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
