import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO } from './dto/log-in.dto';
import { RegisterDTO } from './dto/register.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
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

  @Post('register')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async Register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }
}
