import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO } from './dto/log-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() logInDto: LogInDTO) {
    const user = await this.authService.validateUser(
      logInDto.username,
      logInDto.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }
}
