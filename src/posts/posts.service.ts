import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/create-post.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkData(dto, data) {
    const registerDto = plainToClass(dto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }
  }

  async create(createPostDto: CreatePostDto, token_data) {
    this.checkData(CreatePostDto, createPostDto);

    const data = {
      title: createPostDto.title,
      content: createPostDto.content,
      published: true,
      authorId: token_data['id'],
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
      if(token_data['roleId'] === 0){
        whereCondition.published = true;
      }
      const all = await this.prisma.post.findMany({where: whereCondition});
      
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
    if(token_data['roleId'] === 0){
      whereCondition.published = true;
    }

    const post = await this.prisma.post.findUnique({
      where: whereCondition,
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
      throw new BadRequestException(
        'Only admin can update parametrs of other posts!',
      );
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
      throw new BadRequestException(
        'Only admin can delete parametrs of other posts!',
      );
    }

    await this.prisma.post.delete({ where: { id: delete_PostDto.id } });

    return {
      statusCode: 204,
      message: 'Post deleted successfully',
    };
  }
}
