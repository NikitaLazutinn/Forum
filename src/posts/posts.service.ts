import { select } from './../constants/post.constants';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  LikeDto,
  CreatePostDto,
  DeletePostDto,
  UpdatePostDto,
  AddCommentDto,
  DeleteCommentDto,
} from './dto/create-post.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CategoriesService } from 'src/categories/categories.service';
import { PostFilterDto } from './dto/filter.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private categoriesService: CategoriesService,
  ) {}

  async checkData(dto, data) {
    const registerDto = plainToClass(dto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }
  }

  async create(createPostDto: CreatePostDto, token_data) {
    this.checkData(CreatePostDto, createPostDto);

    await this.categoriesService.ifAvailable(createPostDto.categoriesId);

    const categories = [];
    createPostDto.categoriesId.map((id) =>
      categories.push({
        category: {
          connect: {
            id: id,
          },
        },
      }),
    );

    const data = {
      title: createPostDto.title,
      content: createPostDto.content,
      published: true,
      authorId: token_data['id'],
      categories: {
        create: categories,
      },
    };

    try {
      const post = await this.prisma.post.create({
        data,
      });

      return {
        statusCode: 201,
        message: 'Post created successfully',
        properties: post,
      };
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findAll(token_data) {
    try {
      let whereCondition: any = {};
      if (token_data['roleId'] === 0) {
        whereCondition.published = true;
      }
      const all = await this.prisma.post.findMany({
        where: whereCondition,
        select: select,
      });

      return {
        statusCode: 200,
        posts: all,
      };
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async findOne(id: number, token_data) {
    let whereCondition: any = { id: id };
    if (token_data['roleId'] === 0) {
      whereCondition.published = true;
    }

    const post = await this.prisma.post.findUnique({
      where: whereCondition,
      select: select,
    });

    if (post === null) {
      throw new NotFoundException(`There is no post with id: ${id}`);
    }
    return {
      statusCode: 200,
      post: post,
    };
  }

  async update(updatePostDto: UpdatePostDto, token_data) {
    await this.checkData(UpdatePostDto, updatePostDto);
    await this.categoriesService.ifAvailable(updatePostDto.params.categoriesId);
    const params = updatePostDto.params;

    const post = await this.prisma.post.findUnique({
      where: { id: updatePostDto.id },
    });
    if (post === null) {
      throw new NotFoundException(
        `There is no post with id: ${updatePostDto.id}`,
      );
    }
    if (token_data['roleId'] !== 1 && token_data['id'] !== post.authorId) {
      throw new NotFoundException();
    }

    if (params.title.length > 0) {
      await this.prisma.post.update({
        where: { id: updatePostDto.id },
        data: {
          title: params.title,
        },
      });
    }

    if (params.content.length > 0) {
      await this.prisma.post.update({
        where: { id: updatePostDto.id },
        data: {
          content: params.content,
        },
      });
    }

    await this.prisma.post.update({
      where: { id: updatePostDto.id },
      data: {
        published: params.published,
      },
    });

    await this.categoriesService.UpdateInPost(
      updatePostDto.id,
      updatePostDto.params.categoriesId,
    );

    return {
      statusCode: 201,
      message: 'Post updated successfully',
    };
  }

  async remove(delete_PostDto: DeletePostDto, token_data) {
    await this.checkData(DeletePostDto, delete_PostDto);

    const post = await this.prisma.post.findUnique({
      where: { id: delete_PostDto.id },
    });
    if (post === null) {
      throw new NotFoundException(
        `There is no post with id: ${delete_PostDto.id}`,
      );
    }
    if (token_data['roleId'] !== 1 && token_data['id'] !== post.authorId) {
      throw new NotFoundException();
    }

    await this.categoriesService.DeleteInPost(delete_PostDto.id);
    await this.prisma.post.delete({ where: { id: delete_PostDto.id } });

    return {
      statusCode: 204,
      message: 'Post deleted successfully',
    };
  }

  async filterAndSortPosts(filterDto: PostFilterDto, token_data) {
    const {
      title,
      published,
      content,
      createdAt,
      updatedAt,
      categoryName,
      sortField,
      sortOrder,
      searchQuery,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
      skip = 0,
      take = 10,
    } = filterDto;

    const conditions: any = [
      title ? { title: { contains: title } } : undefined,
      content ? { content: { contains: content } } : undefined,
      createdAt ? { createdAt: { equals: createdAt } } : undefined,
      updatedAt ? { updatedAt: { equals: updatedAt } } : undefined,
      categoryName
        ? {
            categories: {
              some: {
                category: {
                  name: categoryName,
                },
              },
            },
          }
        : undefined,
    ];

    if (searchQuery) {
      conditions.push({
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { content: { contains: searchQuery, mode: 'insensitive' } },
        ],
      });
    }

    if (createdFrom || createdTo) {
      conditions.push({
        createdAt: {
          ...(createdFrom ? { gte: new Date(createdFrom) } : {}),
          ...(createdTo ? { lte: new Date(createdTo) } : {}),
        },
      });
    }

    if (updatedFrom || updatedTo) {
      conditions.push({
        updatedAt: {
          ...(updatedFrom ? { gte: new Date(updatedFrom) } : {}),
          ...(updatedTo ? { lte: new Date(updatedTo) } : {}),
        },
      });
    }

    if (token_data['roleId'] === 1) {
      if (published !== undefined) {
        conditions.push({ published });
      }
    } else {
      conditions.push({ published: true });
    }

    const where = {
      AND: conditions.filter(Boolean),
    };

    const orderBy: any = sortField
      ? { [sortField]: sortOrder === 'desc' ? 'desc' : 'asc' }
      : { createdAt: 'asc' };

    return this.prisma.post.findMany({
      where,
      skip,
      take,
      orderBy,
      select,
    });
  }

  async like(data: LikeDto, token_data) {
    await this.checkData(LikeDto, data);

    const { postId } = data;
    const userId = token_data.id;

    const exist = await this.prisma.like.findFirst({
      where: { userId, postId },
    });

    if (exist === null) {
      const like = await this.prisma.like.create({
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

  async deleteComment(data: DeleteCommentDto, token_data) {
    await this.checkData(DeleteCommentDto, data);
    const { commentId } = data;

    const comm:any = await this.prisma.comment.findUnique({
      where: { id:commentId },
    });

    if (token_data['roleId'] !== 1 && token_data['id'] !== comm.authorId) {
      throw new NotFoundException();
    }
    

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      statusCode: 204,
      message: 'Comment deleted successfully'
    };
  }
}

