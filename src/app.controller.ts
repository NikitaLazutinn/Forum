import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/RegisterDto';
import { UserResponseDto } from './dto/userResponceDto';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: RegisterDto,
  ): Promise<UserResponseDto> {
    return await this.userService.createUser(userData);
  }
}
