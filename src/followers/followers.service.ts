import { BadGatewayException, BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FollowersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async showFollowers(userId: number) {
    let followers = {};

    const count = await this.prisma.followers.count({
      where: { userId: userId },
    });

    if(count > 0){
      followers = await this.prisma.followers.findMany({
        where: { userId: userId },
        select: {
          hisfollower: { select: { id: true, name: true } },
          createdAt: true,
        },
      });
    }


    return {
      statusCode: 200,
      count: count,
      followers: followers,
    };
  }

  async folowing(userId: number) {
    let following = {};
    
    const count = await this.prisma.followers.count({
      where: { followerId: userId },
    });

    if(count > 0){
      following = await this.prisma.followers.findMany({
        where: { followerId: userId },
        select: {
          user: { select: { id: true, name: true } },
          createdAt: true,
        },
      });
    }


    return {
      statusCode: 200,
      count: count,
      following: following,
    };
  }

  async follow(userId: number, token_data) {
    const followerId = token_data.id;

    if (followerId === userId) {
      throw new BadRequestException('You cant follow at yourself');
    }
    await this.userService.find(userId);

    const exist = await this.prisma.followers.findFirst({
      where: { userId, followerId },
    });

    if (exist === null) {
      await this.prisma.followers.create({
        data: {
          userId,
          followerId,
        },
      });

      return {
        statusCode: 201,
        message: 'Followed successfully!',
      };
    }

    await this.prisma.followers.delete({
      where: { id: exist.id },
    });

    return {
      statusCode: 204,
      message: 'Unfollowed successfully',
    };
  }

  async deleteInUser(userId: number) {
    await this.prisma.followers.deleteMany({
      where: {
        OR: [{ userId: userId }, { followerId: userId }],
      },
    });
  }
}
