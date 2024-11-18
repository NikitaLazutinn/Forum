import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import {CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [PrismaModule,forwardRef(() => PostsModule)],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
