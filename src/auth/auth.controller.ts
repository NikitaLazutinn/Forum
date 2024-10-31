import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponseDto } from './dto/RegisterDto';
import { logInDto, logInResponceDto } from './dto/logInDto';
import { linkResetResp, ResetDto } from './dto/resetDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signupUser(
    @Body()
    userData: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(userData);
  }

  @Post('logIn')
  async logIn(
    @Body()
    userData: logInDto,
  ): Promise<logInResponceDto> {
    return await this.authService.logIn(userData);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() email: string): Promise<linkResetResp> {
    return await this.authService.resetPasswordLink(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() Data: ResetDto,
  ) {
    return await this.authService.resetPassword(token, Data);
  }
}
