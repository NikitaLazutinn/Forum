import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import {CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { PostsModule } from 'src/posts/posts.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule,UserModule, forwardRef(() => PostsModule)],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
