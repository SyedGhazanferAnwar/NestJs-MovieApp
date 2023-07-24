import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movies.controller';
import { MovieService } from './movies.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('MovieController', () => {
  let controller: MovieController;
  const jwtServiceMock = {
    verify: () => true,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        AuthGuard,

        {
          provide: MovieService,
          useValue: {}, // Provide an empty object as a mock for AuthService
        },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
