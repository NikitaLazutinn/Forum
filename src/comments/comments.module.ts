import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import {CommentController } from './comments.controller';
import { CommentService } from './comments.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
