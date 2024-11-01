import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  Delete_UserDto,
  Update_UserDto,
} from './dto/create-user.dto';
import { AuthGuard } from 'src/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('edit')
  async update(@Body() UpdateUserDto: Update_UserDto, @Req() request) {
    const tokenData = request.user;
    return this.userService.update_user(UpdateUserDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async remove(@Body() DeleteUserDto: Delete_UserDto, @Req() request) {
    const tokenData = request.user;
    return this.userService.remove(DeleteUserDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Patch('give_admin')
  async give_admin(@Body() id: number, @Req() request) {
    const tokenData = request.user;
    return this.userService.admin(id, tokenData);
  }
}
