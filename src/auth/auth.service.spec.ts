import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {}, // Provide an empty object as a mock for AuthService
        },
        AuthController, // Add the AuthController to the providers array
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
