import { CommentsModule } from './../comments/comments.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { LikesModule } from 'src/likes/likes.module';
import { StatisticsService } from './statistcs.service';
import { StatisticsController } from './statistcs.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '5000s' },
    }),
    UserModule,
    CategoriesModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatistcsModule {}
