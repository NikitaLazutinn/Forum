import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  LikeDto
} from './dto/create.dto';

@Injectable()
export class LiklesService {
  constructor(private prisma: PrismaService) {}

  async showLikes(data: LikeDto) {
    const { postId } = data;

    const likes = await this.prisma.like.findMany({ where: { postId } });

    return {
      statusCode: 200,
      likes: likes,
    };
  }

  async like(postId: number, token_data) {
    const userId = token_data.id;

    const exist = await this.prisma.like.findFirst({
      where: { userId, postId },
    });

    if (exist === null) {
      await this.prisma.like.create({
        data: {
          postId,
          userId,
        },
      });

      return {
        statusCode: 201,
        message: 'Like added successfully',
      };
    }

    await this.prisma.like.delete({
      where: { id: exist.id },
    });

    return {
      statusCode: 204,
      message: 'Like deleted successfully',
    };
  }
}
