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
  UpdatePostDto
} from './dto/create-post.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CategoriesService } from 'src/categories/categories.service';
import { PostFilterDto } from './dto/filter.dto';
import { CommentService } from 'src/comments/comments.service';
import { ShowCommentDto,AddCommentDto,DeleteCommentDto,EditCommentDto} from './dto/comment_dto';
import { LiklesService } from 'src/likes/likes.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private categoriesService: CategoriesService,
    private commentService: CommentService,
    private liklesService: LiklesService,
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
      userId: token_data['id'],
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

  async update(id: number, updatePostDto: UpdatePostDto, token_data) {
    await this.checkData(UpdatePostDto, updatePostDto);
    await this.categoriesService.ifAvailable(updatePostDto.params.categoriesId);
    const params = updatePostDto.params;

    const post = await this.prisma.post.findUnique({
      where: { id: id },
    });
    if (post === null) {
      throw new NotFoundException(
        `There is no post with id: ${id}`,
      );
    }
    if (token_data['roleId'] !== 1 && token_data['id'] !== post.userId) {
      throw new NotFoundException();
    }

    if (params.title.length > 0) {
      await this.prisma.post.update({
        where: { id: id },
        data: {
          title: params.title,
        },
      });
    }

    if (params.content.length > 0) {
      await this.prisma.post.update({
        where: { id: id },
        data: {
          content: params.content,
        },
      });
    }

    await this.prisma.post.update({
      where: { id: id },
      data: {
        published: params.published,
      },
    });

    await this.categoriesService.UpdateInPost(
      id,
      updatePostDto.params.categoriesId,
    );

    return {
      statusCode: 201,
      message: 'Post updated successfully',
    };
  }

  async remove(id:number, token_data) {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
    });
    if (post === null) {
      throw new NotFoundException(
        `There is no post with id: ${id}`,
      );
    }
    if (token_data['roleId'] !== 1 && token_data['id'] !== post.userId) {
      throw new NotFoundException();
    }

    await this.categoriesService.DeleteInPost(id);
    await this.prisma.post.delete({ where: { id: id } });

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

}

