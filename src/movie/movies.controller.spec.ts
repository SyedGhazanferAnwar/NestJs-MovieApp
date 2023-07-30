import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movies.controller';
import { MovieService } from './movies.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;

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
          useValue: {
            create: jest.fn(),
          }, // Provide an empty object as a mock for AuthService
        },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  describe('create movie', () => {
    const createMovieInput = {
      name: 'test435-movie',
      description: 'test-movie description',
      release_date: '30/12/2009',
      ticket_price: 30,
      country: 'pakistan',
      genre: 'action',
      photo_uri: 'test-image uri',
    };

    const resp: any = {
      name: 'test435-movie',
      description: 'test-movie description',
      release_date: '30/12/2009',
      ticket_price: 30,
      country: 'pakistan',
      genre: 'action',
      photo_uri: 'test-image uri',
      ratings: [],
      comments: [],
      _id: '64c696c8bb2961dbd51b94d2',
      __v: 0,
    };

    it('should register a user', async () => {
      jest.spyOn(movieService, 'create').mockResolvedValue(resp);
      const result = await movieController.create(createMovieInput);
      expect(result).toEqual(resp);
      expect(movieService.create).toHaveBeenCalledWith(createMovieInput);
    });
  });
});
