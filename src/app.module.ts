import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';

@Module({
  imports: [],

  controllers: [AppController],
  providers: [PrismaService, UserService],
})
export class AppModule {}
