import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  Delete_UserDto,
  Update_UserDto,
} from './dto/create-user.dto';

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

  @Patch('edit')
  async update(@Body() UpdateUserDto: Update_UserDto) {
    return this.userService.update(UpdateUserDto);
  }

  @Delete('delete')
  async remove(@Body() DeleteUserDto: Delete_UserDto) {
    return this.userService.remove(DeleteUserDto);
  }
}
