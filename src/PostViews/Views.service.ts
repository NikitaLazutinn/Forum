import { Injectable, ForbiddenException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { User, Post } from '@prisma/client';
import { PostsService } from 'src/posts/posts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ViewsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async count(userId: string, post: Post) {
    const user = await this.userService.find(+userId);
    const isAuthor = post.userId === user.id;
    const isArchived = !post.published;

    if (!isAuthor && !isArchived) {
      const existing = await this.prisma.views.findFirst({
        where: {
          postId: post.id,
          userId: user.id,
        },
      });

      if (!existing) {
        await this.prisma.views.create({
          data: {
            postId: post.id,
            userId: user.id,
          },
        });
      }
    }

    return this.prisma.views.count({
      where: { postId: post.id },
    });
  }
}
