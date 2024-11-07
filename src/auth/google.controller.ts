import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/google')
export class AuthController {
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('b');
    // Цей метод перенаправляє до Google для авторизації
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // Після авторизації перенаправляє сюди
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }
}
