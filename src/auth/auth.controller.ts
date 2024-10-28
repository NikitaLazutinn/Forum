import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponseDto } from './dto/RegisterDto';
import { logInDto, logInResponceDto } from './dto/logInDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signupUser(
    @Body()
    userData: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.createUser(userData);
  }

  @Post('logIn')
  async logIn(
    @Body()
    userData: logInDto,
  ): Promise<logInResponceDto> {
    return await this.authService.logIn(userData);
  }
}
