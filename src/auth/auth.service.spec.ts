import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './user/user.schema';
import { RegisterDTO } from './dto/register.dto';
import { LogInDTO } from './dto/log-in.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  // Mock User model
  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  // Mock JwtService
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDTO = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValueOnce(null);
      mockUserModel.create.mockResolvedValueOnce({
        ...registerDto,
        _id: 'user123',
      });

      const result = await authService.register(registerDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ 
        $or: [
          { username: registerDto.username }, 
          { email: registerDto.email }
        ]
      });
      expect(mockUserModel.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw an error if user already exists', async () => {
      const registerDto: RegisterDTO = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValueOnce({ username: 'existinguser' });

      await expect(authService.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginDto: LogInDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
      };

      mockUserModel.findOne.mockResolvedValueOnce(mockUser);
      mockJwtService.sign.mockReturnValueOnce('mocktoken');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        access_token: 'mocktoken',
        user: {
          username: mockUser.username,
          _id: mockUser._id,
        },
      });
    });

    it('should throw an error for invalid credentials', async () => {
      const loginDto: LogInDTO = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      mockUserModel.findOne.mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});