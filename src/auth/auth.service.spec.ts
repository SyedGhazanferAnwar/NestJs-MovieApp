import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/log-in.dto';
import * as bcrypt from 'bcrypt';

// Mock dependencies
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: any;
  let jwtService: JwtService;

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
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'strongpassword123',
    };

    it('should successfully register a new user', async () => {
      // Simulate user not existing
      mockUserModel.findOne.mockResolvedValue(null);
      
      // Simulate user creation
      const createdUser = {
        ...validRegisterDto,
        _id: 'mock_user_id',
      };
      mockUserModel.create.mockResolvedValue(createdUser);

      const result = await authService.register(validRegisterDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ 
        $or: [
          { email: validRegisterDto.email },
          { username: validRegisterDto.username }
        ]
      });
      expect(mockUserModel.create).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
    });

    it('should throw an error if user already exists', async () => {
      // Simulate existing user
      mockUserModel.findOne.mockResolvedValue({
        username: validRegisterDto.username,
        email: validRegisterDto.email,
      });

      await expect(authService.register(validRegisterDto))
        .rejects
        .toThrow('User already exists');
    });
  });

  describe('login', () => {
    const validLoginDto: LogInDto = {
      email: 'test@example.com',
      password: 'correctpassword',
    };

    it('should successfully login with correct credentials', async () => {
      // Simulate user found with correct password
      const mockUser = {
        _id: 'mock_user_id',
        email: validLoginDto.email,
        password: await bcrypt.hash(validLoginDto.password, 10),
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await authService.login(validLoginDto);

      expect(result).toHaveProperty('token');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw error for non-existent user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(authService.login(validLoginDto))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        _id: 'mock_user_id',
        email: validLoginDto.email,
        password: await bcrypt.hash('differentpassword', 10),
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(authService.login(validLoginDto))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
});