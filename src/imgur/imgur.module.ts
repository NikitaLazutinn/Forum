import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ImgurController } from './imgur.controller';
import { ImgurService } from './imgur.service';
import { UserModule } from 'src/user/user.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '5000s' },
    }),
    UserModule,
    PostsModule
  ],
  controllers: [ImgurController],
  providers: [ImgurService],
  exports: [ImgurService],
})
export class ImgurModule {}
