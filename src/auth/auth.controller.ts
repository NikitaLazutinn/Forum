import {
  Controller,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponseDto } from './dto/RegisterDto';
import { logInDto, logInResponceDto } from './dto/logInDto';
import { linkResetResp, ResetDto } from './dto/resetDto';
import { AuthGuard } from '@nestjs/passport';
//import { seed } from './seed';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get('seed')
  // async seed(){
  //   await seed();
  // }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, 
  @Res() res) {

    const token_data = req.user;
    const {accessToken} = await this.authService.googleAuth(token_data);

    return res.redirect(`${process.env.LINK_FRONTEND}/auth/googleCallback?token=${accessToken}`);

  }

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

  @Get('reset-password-checkToken')
  async resetPasswordCheckToken(@Query('token') token: string) {
    return this.authService.CheckToken(token);
  }

  @Post('reset-password')
  async resetPassword(@Query('token') token: string, @Body() Data: ResetDto) {
    return await this.authService.resetPassword(token, Data);
  }
}
