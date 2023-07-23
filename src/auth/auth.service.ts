import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users = [
    { userId: 1, username: 'user1', password: 'password' },
    { userId: 2, username: 'user2', password: 'password' },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
