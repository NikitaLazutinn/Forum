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
import * as bcrypt from 'bcrypt';
import { logInDto, logInResponceDto } from './dto/logInDto';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';

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

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    const registerDto = plainToClass(RegisterDto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }

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

async sendResetPasswordLink(data: string): Promise<void> {
    const email = data['email'];
    const responce = await this.user_service.findEmail(email);
    const user = responce.user;
    if (user === null) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );
    const resetLink = `https://your-frontend-url.com/reset-password?token=${token}`;


    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
          user: process.env.EMAIL,
          pass: process.env.PASSWORD     
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to:email,
      subject:"Resetting password",
      text: `To reset your password, please click the following link: ${resetLink}`,
      html: `<p>To reset your password, please click the following link:</p><a href="${resetLink}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions,function(error){

      if(error){
        throw new BadRequestException(error);
      }else{
        return {
          statusCode: 201,
          message: 'Link for resettimg created successfully!'
        };
      }

 });


  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.userId;

      const hashedPassword:string = await this.hashPassword(newPassword);
      const dtoData = {
        token: token,
        id: userId,
        params: { name: '', email: '', password: hashedPassword },
      };
      await this.user_service.update_user(dtoData);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
