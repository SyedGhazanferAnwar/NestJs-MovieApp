import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movies.service';
import { MovieController } from './movies.controller';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('MovieService', () => {
  let service: MovieService;
  const jwtServiceMock = {
    verify: () => true,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: MovieService,
          useValue: {}, // Provide an empty object as a mock for AuthService
        },
        { provide: JwtService, useValue: jwtServiceMock },
        MovieController, // Add the AuthController to the providers array
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
