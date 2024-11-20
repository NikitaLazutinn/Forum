import { CommentsModule } from './../comments/comments.module';
import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from 'src/categories/categories.module';
import { LikesModule } from 'src/likes/likes.module';
import { ViewsModule } from 'src/PostViews/Views.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '5000s' },
    }),
    forwardRef(() => CommentsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => LikesModule),
    forwardRef(() => ViewsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
