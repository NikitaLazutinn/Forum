import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, Delete_UserDto, FindUserDto, Update_UserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
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
  create(createUserDto: CreateUserDto) {
    const data = this.decode(createUserDto.token);
    if (data['roleId'] == 0) {
      throw new BadRequestException('You are not admin!');
    }
    return 'This action adds a new user';
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

  async findOne(id: number) {
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

  async update(UpdateUserDto: Update_UserDto) {
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
    const token_data = this.decode(DeleteUserDto.token);
    if (token_data['roleId'] != 1 && token_data['id'] != DeleteUserDto.id) {
      throw new BadRequestException(
        'Only admin can delete other users!',
      );
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
