import { Test, TestingModule } from '@nestjs/testing';
import { PublicaionsController } from './publications.controller';
import { PublicaionsService } from './publications.service';

describe('PublicaionsController', () => {
  let controller: PublicaionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicaionsController],
      providers: [PublicaionsService],
    }).compile();

    controller = module.get<PublicaionsController>(PublicaionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
