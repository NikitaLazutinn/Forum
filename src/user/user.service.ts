import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Delete_UserDto,
  Update_UserDto,
} from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';

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

  async create(data) {
    //const data = this.decode(createUserDto.token);
    // if (data['roleId'] === 0) {
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
    if (user === null) {
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

    return {
      statusCode: 200,
      user: user,
    };
  }

  async update_user(UpdateUserDto: Update_UserDto, token_data) {
    await this.checkData(Update_UserDto, UpdateUserDto);
    const params = UpdateUserDto.params;
    if (token_data['roleId'] !== 1 && token_data['id'] !== UpdateUserDto.id) {
      throw new BadRequestException(
        'Only admin can update parametrs of other users!',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: UpdateUserDto.id },
    });
    if (user === null) {
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

    if (params.password.length > 0) {
      await this.prisma.user.update({
        where: { id: UpdateUserDto.id },
        data: {
          password: params.password,
        },
      });
    }

    return {
      statusCode: 201,
      message: 'User updated successfully',
    };
  }

  async remove(DeleteUserDto: Delete_UserDto, token_data) {
    await this.checkData(Delete_UserDto, DeleteUserDto);
    if (token_data['roleId'] !== 1 && token_data['id'] !== DeleteUserDto.id) {
      throw new BadRequestException('Only admin can delete other users!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: DeleteUserDto.id },
    });
    if (user === null) {
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

  async admin(data: number, token_data) {
    const id = data['id'];
    if (token_data['roleId'] !== 1) {
      throw new NotFoundException('Only admin can use this endpoint!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (user === null) {
      throw new NotFoundException(
        `There is no user with id: ${id}`,
      );
    }
    await this.prisma.user.update({
      where: { id: id },
      data: {
        roleId: 1,
      },
    });

    return {
      statusCode: 201,
      message: 'Admin role gived successfully',
    };
  }
}
