import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  Update_UserDto,
} from './dto/create-user.dto';
import { AuthGuardCustom } from 'src/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Get('followers/:id')
  async userFollowers(@Param('id') id: string) {
    return this.userService.followers(+id);
  }

  @Get('following/:id')
  async userFollowing(@Param('id') id: string) {
    return this.userService.follwing(+id);
  }

  @UseGuards(AuthGuardCustom)
  @Patch('edit/:id')
  async update(
    @Param('id') id: number,
    @Body() UpdateUserDto: Update_UserDto,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.userService.update_user(+id, UpdateUserDto, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Delete('delete/:id')
  async remove(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.userService.remove(+id, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Patch('adminStatus/:id')
  async adminStatus(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.userService.admin(+id, tokenData);
  }
}
