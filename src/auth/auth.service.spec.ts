import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user/user.schema';
import { RegisterDTO } from './dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserModel: Model<User>;
  let mockJwtService: JwtService;

  const mockUser = {
    _id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    passwordHash: 'hashed-password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mockUserModel = module.get<Model<User>>(getModelToken(User.name));
    mockJwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user without password hash if credentials are valid', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser('testuser', 'password');
      
      expect(result).toEqual({
        _id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent', 'password');
      
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await authService.validateUser('testuser', 'wrongpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = await authService.login(mockUser);
      
      expect(result).toEqual({ access_token: 'mock-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: 'test-user-id',
        username: 'testuser',
      });
    });
  });

  describe('register', () => {
    const registerDto: RegisterDTO = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    };

    it('should successfully register a new user', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mock-salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
      
      const mockSavedUser = {
        ...mockUser, 
        ...registerDto, 
        passwordHash: 'hashed-password', 
        save: jest.fn().mockResolvedValue(mockUser)
      };
      jest.spyOn(mockUserModel.prototype, 'save').mockResolvedValue(mockSavedUser as any);

      const result = await authService.register(registerDto);
      
      expect(result).toEqual({
        username: 'newuser',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      });
    });

    it('should throw an exception if user already exists', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser as any);

      await expect(authService.register(registerDto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.UNAUTHORIZED)
      );
    });
  });
});