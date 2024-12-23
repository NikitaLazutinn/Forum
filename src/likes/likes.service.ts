import {
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class LiklesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {}

  async showLikes(postId: number) {
    const likes = await this.prisma.like.findMany({ where: { postId } });

    return {
      statusCode: 200,
      likes: likes,
    };
  }

  async like(postId: number, token_data) {
    const userId = token_data.id;
    await this.postsService.findOne(postId, token_data);

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

  async deleteInPost(postId: number) {
    await this.prisma.like.deleteMany({ where: { postId: postId } });
  }
}
