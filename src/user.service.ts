import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterDto } from './dto/RegisterDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/userResponceDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: RegisterDto): Promise<UserResponseDto> {
    const registerDto = plainToClass(RegisterDto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser == null) {
        if (data.password !== data.confirmPassword) {
          throw new BadRequestException('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        const lastKey = Object.keys(data).pop();
        if (lastKey) {
          delete data[lastKey];
        }

        const user = await this.prisma.user.create({
          data,
        });

        return {
          statusCode: 201,
          message: 'User created successfully',
          properties: user,
        };
      } else {
        throw new BadRequestException('User already exists');
      }
    } catch (error) {
      throw error;
    }
  }
}
