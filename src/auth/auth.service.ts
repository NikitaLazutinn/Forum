import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, RegisterResponseDto } from './dto/RegisterDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { logInDto, logInResponceDto } from './dto/logInDto';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';
import { linkResetResp, ResetDto } from './dto/resetDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private user_service: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async checkData(dto, data) {
    const registerDto = plainToClass(dto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }
  }

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    await this.checkData(RegisterDto, data);

    try {
      const responce = await this.user_service.findEmail(data.email);

      if (responce.user !== null) {
        throw new BadRequestException('User already exists');
      }
      if (data.password !== data.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const hashedPassword = await this.hashPassword(data.password);
      data.password = hashedPassword;
      const lastKey = Object.keys(data).pop();
      if (lastKey) {
        delete data[lastKey];
      }

      const user = await this.user_service.create(data);

      return {
        statusCode: 201,
        message: 'User created successfully',
        properties: { name: user.name, email: user.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async googleAuth(data) {
    try {
      const find = await this.user_service.findEmail(data.email);
      const existing: any = find.user;

      if (existing !== null) {
        const tokenParametrs = {
          id: existing.id,
          roleId: existing.roleId,
        };

        const JWToken = this.generateAccessToken(tokenParametrs);

        return {
          statusCode: 200,
          message: 'User loggedIn successfully',
          name: existing.name,
          accessToken: JWToken,
        };
      }

      let name = '';
      data.firstName ? (name += data.firstName) : 0;
      data.lastName ? (name += data.lastName) : 0;

      const hashedPassword = await this.hashPassword('');
      const registerData = {
        email: data.email,
        name: name,
        password: hashedPassword,
      };

      const user = await this.user_service.create(registerData);
      const tokenParametrs = {
        id: user.id,
        roleId: user.roleId,
      };
      const JWToken = this.generateAccessToken(tokenParametrs);

      return {
        statusCode: 201,
        message: 'User created successfully',
        properties: { name: user.name, email: user.email },
        token: JWToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logIn(data: logInDto): Promise<logInResponceDto> {
    await this.checkData(logInDto, data);

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser === null) {
        throw new NotFoundException('No such user registered');
      }
      const isMatch = await bcrypt.compare(
        data.password,
        existingUser.password,
      
      );

      if (!isMatch) {
        throw new BadRequestException('Invalid password');
      }

      const tokenParametrs = {
        id: existingUser.id,
        roleId: existingUser.roleId,
      };

      const accessToken = this.generateAccessToken(tokenParametrs);
      const refreshToken = this.generateRefreshToken(tokenParametrs);

      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          lastLoggedIn: new Date(),
        },
      });

      return {
        name: existingUser.name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  private generateAccessToken(params: { id: number; roleId: number }): string {
    return this.jwtService.sign(params);
  }

  private generateRefreshToken(params: { id: number; roleId: number }): string {
    return this.jwtService.sign(params, { expiresIn: '7d' });
  }

  async resetPasswordLink(data: string): Promise<linkResetResp> {
    if (typeof data['email'] !== 'string') {
      throw new BadRequestException(`Invalid data format!`);
    }
    const email = data['email'];
    const responce = await this.user_service.findEmail(email);
    const user = responce.user;
    if (user === null) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
    const link = process.env.LINK_FRONTEND;
    const resetLink = `${link}/auth/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Resetting password',
      text: `To reset your password, please click the following link: ${resetLink}`,
      html: `<p>To reset your password, please click the following link:</p><a href="${resetLink}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions, function (error) {
      if (error) {
        throw new BadRequestException(error);
      }
    });
    return {
      statusCode: 201,
      message: 'Link for resettimg created successfully!',
    };
  }

  async resetPassword(token: string, body: ResetDto): Promise<linkResetResp> {
    await this.checkData(ResetDto, body);
    let tokenData;
    
    try {
      tokenData = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
      const userId = tokenData.id;

      if (body.password !== body.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      const hashedPassword: string = await this.hashPassword(body['password']);
      const updateData = {
        name: '',
        email: '',
        password: hashedPassword,
      };
    return await this.user_service.update_user(userId, updateData, tokenData);
    
  }
}
