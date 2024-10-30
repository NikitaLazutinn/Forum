import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  Delete_UserDto,
  Update_UserDto,
} from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from 'src/auth/dto/RegisterDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async checkData(dto, data) {
    const registerDto = plainToClass(dto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }
  }
  decode(data) {
    try {
      const secret = process.env.JWT_SECRET;
      const verified = jwt.verify(data, secret);
      return verified;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid token');
    }
  }
  async create(data) {
    //const data = this.decode(createUserDto.token);
    // if (data['roleId'] == 0) {
    //   throw new BadRequestException('You are not admin!');
    // }
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async findAll() {
    try {
      const all = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          lastLoggedIn: true,
        },
      });
      return {
        statusCode: 200,
        users: all,
      };
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLoggedIn: true,
      },
    });
    if (user == null) {
      throw new NotFoundException(`There is no user with id: ${id}`);
    }
    return {
      statusCode: 200,
      user: user,
    };
  }

  async findEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLoggedIn: true,
      },
    });

    return user;
  }

  async update(UpdateUserDto: Update_UserDto) {
    await this.checkData(Update_UserDto, UpdateUserDto);
    const token_data = this.decode(UpdateUserDto.token);
    const params = UpdateUserDto.params;
    if (token_data['roleId'] != 1 && token_data['id'] != UpdateUserDto.id) {
      throw new BadRequestException(
        'Only admin can update parametrs of other users!',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: UpdateUserDto.id },
    });
    if (user == null) {
      throw new NotFoundException(
        `There is no user with id: ${UpdateUserDto.id}`,
      );
    }

    if (params.email.length > 0) {
      await this.prisma.user.update({
        where: { id: UpdateUserDto.id },
        data: {
          email: params.email,
        },
      });
    }

    if (params.name.length > 0) {
      await this.prisma.user.update({
        where: { id: UpdateUserDto.id },
        data: {
          name: params.name,
        },
      });
    }

    return {
      statusCode: 201,
      message: 'User updated successfully',
    };
  }

  async remove(DeleteUserDto: Delete_UserDto) {
    await this.checkData(Delete_UserDto, DeleteUserDto);
    const token_data = this.decode(DeleteUserDto.token);
    if (token_data['roleId'] != 1 && token_data['id'] != DeleteUserDto.id) {
      throw new BadRequestException('Only admin can delete other users!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: DeleteUserDto.id },
    });
    if (user == null) {
      throw new NotFoundException(
        `There is no user with id: ${DeleteUserDto.id}`,
      );
    }
    await this.prisma.user.delete({ where: { id: DeleteUserDto.id } });

    return {
      statusCode: 204,
      message: 'User deleted successfully',
    };
  }
}
