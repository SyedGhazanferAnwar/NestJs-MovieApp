import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/log-in.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: any;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'user_id',
    email: 'test@example.com',
    username: 'testuser',
    password: '',
    firstName: 'Test',
    lastName: 'User'
  };

  beforeEach(async () => {
    mockUser.password = await bcrypt.hash('password123', 10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_jwt_token')
          }
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };

    it('should successfully register a new user', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser);

      const result = await authService.register(validRegisterDto);

      expect(result).toHaveProperty('token');
      expect(userModel.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(userModel.create).toHaveBeenCalledWith(expect.objectContaining({
        email: validRegisterDto.email,
        username: validRegisterDto.username
      }));
    });

    it('should throw an error if user already exists', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      await expect(authService.register(validRegisterDto))
        .rejects
        .toThrow('User already exists');
    });
  });

  describe('login', () => {
    const validLoginDto: LogInDto = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should successfully login with correct credentials', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      const result = await authService.login(validLoginDto);

      expect(result).toHaveProperty('token');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw unauthorized exception for non-existent user', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(authService.login(validLoginDto))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw unauthorized exception for incorrect password', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      const invalidLoginDto = { ...validLoginDto, password: 'wrongpassword' };

      await expect(authService.login(invalidLoginDto))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});