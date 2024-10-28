import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/RegisterDto';
import { UserResponseDto } from './dto/userResponceDto';

@Controller()
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: RegisterDto,
  ): Promise<UserResponseDto> {
    return await this.userService.createUser(userData);
  }
}
