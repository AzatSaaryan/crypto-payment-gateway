import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) userData: CreateUserDto) {
    return this.authService.registerUser(
      userData.email,
      userData.password,
      userData.username,
    );
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) userData: LoginUserDto) {
    return this.authService.loginUser(userData.email, userData.password);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    return this.authService.logoutUser(authHeader);
  }
}
