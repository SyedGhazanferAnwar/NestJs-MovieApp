import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './dto/register.dto';
import { User } from './user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserResponseDTO } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).lean(true);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        delete user.passwordHash;
        return user;
      }
      return null;
    }
    return null;
  }

  async login(user: any) {
    const payload = { userId: user._id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(registerDto: RegisterDTO): Promise<UserResponseDTO> {
    const { username, email, password, firstName, lastName } = registerDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.UNAUTHORIZED);
    }
    const salt = await bcrypt.genSalt();

    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      firstName,
      lastName,
      username,
      email,
      passwordHash: passwordHash,
    });
    const user = await newUser.save();
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
  }
}
