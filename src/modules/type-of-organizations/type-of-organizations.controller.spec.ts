import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfOrganizationsController } from './type-of-organizations.controller';
import { TypeOfOrganizationsService } from './type-of-organizations.service';

describe('TypeOfOrganizationsController', () => {
  let controller: TypeOfOrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfOrganizationsController],
      providers: [TypeOfOrganizationsService],
    }).compile();

    controller = module.get<TypeOfOrganizationsController>(TypeOfOrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
