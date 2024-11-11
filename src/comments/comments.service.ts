import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { AddCommentDto, DeleteCommentDto, EditCommentDto, ShowCommentDto } from './dto/create.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async addComment(data: AddCommentDto, token_data) {
    const { postId, content } = data;
    const userId = token_data.id;

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
    });

    return {
      statusCode: 201,
      message: 'Comment added successfully',
      comment: comment,
    };
  }

  async showComments(data: number) {
    const postId = data['postId'];

    const comments = await this.prisma.comment.findMany({ where: { postId } });

    return {
      statusCode: 200,
      comments: comments,
    };
  }

  async editComment(commentId: number, data: EditCommentDto, token_data) {
    const { content } = data;
    const userId = token_data.id;

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (userId !== comment.userId) {
      throw new BadRequestException('This is not your comment!');
    }

    await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content,
        updatedAt: new Date(),
      },
    });

    return {
      statusCode: 203,
      message: 'Comment updated successfully!',
      content: content,
    };
  }

  async deleteComment(commentId:number, token_data) {

    const comm: any = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (token_data['roleId'] !== 1 && token_data['id'] !== comm.authorId) {
      throw new NotFoundException();
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      statusCode: 204,
      message: 'Comment deleted successfully',
    };
  }
}
