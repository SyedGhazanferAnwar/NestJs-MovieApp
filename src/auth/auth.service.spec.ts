import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './user/user.schema';
import { RegisterDTO } from './dto/register.dto';
import { LogInDTO } from './dto/log-in.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  // Mock Model
  const mockUserModel = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  // Mock User instance
  const mockUser = {
    _id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    passwordHash: 'hashedpassword',
    save: jest.fn(),
    lean: jest.fn(),
  };

  // Mock JwtService
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocktoken'),
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
        firstName: 'Test',
        lastName: 'User',
      };

      // Simulate no existing user
      mockUserModel.findOne.mockResolvedValueOnce(null);

      // Mock save method
      const savedUser = {
        ...registerDto,
        passwordHash: expect.any(String),
      };
      mockUserModel.save.mockResolvedValueOnce(savedUser);

      const result = await authService.register(registerDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ 
        $or: [
          { username: registerDto.username }, 
          { email: registerDto.email }
        ]
      });
      expect(result).toEqual({
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        username: registerDto.username,
      });
    });

    it('should throw an error if user already exists', async () => {
      const registerDto: RegisterDTO = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
      };

      mockUserModel.findOne.mockResolvedValueOnce({ username: 'existinguser' });

      await expect(authService.register(registerDto)).rejects.toThrow(HttpException);
      await expect(authService.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare mock user with lean method
      const mockUserWithLean = {
        ...mockUser,
        passwordHash: hashedPassword,
        lean: jest.fn().mockReturnValue({
          ...mockUser,
          passwordHash: hashedPassword,
        }),
      };

      mockUserModel.findOne.mockReturnValueOnce(mockUserWithLean);

      const result = await authService.validateUser(username, password);

      const expectedResult = { ...mockUser };
      delete expectedResult.passwordHash;

      expect(result).toEqual(expectedResult);
    });

    it('should return null for invalid credentials', async () => {
      const username = 'testuser';
      const password = 'password123';
      const wrongPassword = 'wrongpassword';

      mockUserModel.findOne.mockResolvedValueOnce(null);

      const result = await authService.validateUser(username, wrongPassword);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate access token', async () => {
      const mockLoginUser = {
        _id: 'user123',
        username: 'testuser',
      };

      const result = await authService.login(mockLoginUser);

      expect(result).toEqual({
        access_token: 'mocktoken',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockLoginUser._id,
        username: mockLoginUser.username,
      });
    });
  });
});