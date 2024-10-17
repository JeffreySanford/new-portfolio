import { Test, TestingModule } from '@nestjs/testing';
import { OpenSkyController } from './opensky.controller';
import { OpenSkyService } from './opensky.service';
import { HttpService } from '@nestjs/axios';

describe('OpenskyController', () => {
  let controller: OpenSkyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenSkyController],
      providers: [
        OpenSkyService,
        {
          provide: HttpService,
          useValue: {}, // Mock HttpService
        },
      ],
    }).compile();

    controller = module.get<OpenSkyController>(OpenSkyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
