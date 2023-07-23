import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movies.service';
import { MovieController } from './movies.controller';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieService,
          useValue: {}, // Provide an empty object as a mock for AuthService
        },
        MovieController, // Add the AuthController to the providers array
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
