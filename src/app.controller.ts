import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Param,
} from '@nestjs/common';
//import { createDto } from './dto/Create.dto';
import { AppService } from './app.service';
import { RegisterDto } from './dto/RegisterDto';

@Controller('auth')
export class AppController {
  constructor(private readonly Service: AppService) {}

  @Post()
  Register(@Body() RegisterDto: RegisterDto) {
    return this.Service.create(RegisterDto);
  }

  @Get(':num')
  @Redirect()
  async redirect(@Param('num') num: number) {
    const link = await this.Service.GetLink(num);
    return { url: link };
  }

  @Get('/stats/:num')
  async stats(@Param('num') num: number) {
    const stats = await this.Service.getStatistic(num);
    return stats;
  }
}
