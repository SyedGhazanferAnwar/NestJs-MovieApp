import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          }, // Provide an empty object as a mock for AuthController
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    const registerInput = {
      firstName: 'test firstname',
      lastName: 'test lastname',
      email: 'test@test.com',
      username: 'testusername',
      password: 'testpass',
    };

    const resp: any = {
      firstName: 'test firstname',
      lastName: 'test lastname',
      email: 'test@test.com',
      username: 'testusername',
    };

    it('should register a user', async () => {
      jest.spyOn(authService, 'register').mockResolvedValue(resp);
      const result = await authController.Register(registerInput);
      expect(result).toEqual(resp);
      expect(authService.register).toHaveBeenCalledWith(registerInput);
    });
  });
});
