import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, RegisterResponseDto } from './dto/RegisterDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { logInDto, logInResponceDto } from './dto/logInDto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(data: RegisterDto): Promise<RegisterResponseDto> {
    const registerDto = plainToClass(RegisterDto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser != null) {
        throw new BadRequestException('User already exists');
      }
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
        properties: {name: user.name, email: user.email}
      };
    } catch (error) {
      throw error;
    }
  }

  async logIn(data: logInDto): Promise<logInResponceDto> {
    const LogInDto = plainToClass(logInDto, data);
    const errors = await validate(LogInDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser == null) {
        throw new NotFoundException('No such user registered');
      }

      const isMatch = await bcrypt.compare(
        data.password,
        existingUser.password,
      );

      if (!isMatch) {
        throw new BadRequestException('Invalid password');
      }

      const tokenParametrs = {id:existingUser.id, roleId:existingUser.roleId};

      const accessToken = this.generateAccessToken(tokenParametrs);
      const refreshToken = this.generateRefreshToken(tokenParametrs);

      return {
        name: existingUser.name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  private generateAccessToken(params: {id:number, roleId:number}): string {
    return this.jwtService.sign(params);
  }

  private generateRefreshToken(params: {id:number, roleId:number}): string {
    return this.jwtService.sign(params, { expiresIn: '7d' });
  }
}