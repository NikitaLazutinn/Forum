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

  async checkData(dto, data) {
    const registerDto = plainToClass(dto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }
  }

  async addComment(data: AddCommentDto, token_data) {
    await this.checkData(AddCommentDto, data);

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

  async showComments(data: ShowCommentDto) {
    await this.checkData(ShowCommentDto, data);

    const { postId } = data;

    const comments = await this.prisma.comment.findMany({ where: { postId } });

    return {
      statusCode: 200,
      comments: comments,
    };
  }

  async editComment(data: EditCommentDto, token_data) {
    await this.checkData(EditCommentDto, data);

    const { commentId, content } = data;
    const userId = token_data.id;

    const comment = await this.prisma.comment.findUnique({where:{id:commentId}});

    if(userId !== comment.userId){
      throw new BadRequestException('This is not your comment!');
    }

    await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content,
      },
    });


    return {
      statusCode: 203,
      message: 'Comment updated successfully!',
      comment: comment,
    };
  }

  async deleteComment(data: DeleteCommentDto, token_data) {
    await this.checkData(DeleteCommentDto, data);
    const { commentId } = data;

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
