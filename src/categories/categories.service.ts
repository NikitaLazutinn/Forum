import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDto, UpdateDto } from './dto/create.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async checkData(dto, data) {
    const registerDto = plainToClass(dto, data);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid data format');
    }
  }

  async create(data, token_data) {
    await this.checkData(CreateDto, data);

    if (token_data['roleId'] !== 1) {
      throw new NotFoundException();
    }
    try {
      const category = await this.prisma.category.create({
        data,
      });

      return {
        statusCode: 201,
        message: 'Category created successfully',
        properties: category,
      };
    } catch (err) {
      throw new BadRequestException('This category alredy exists!');
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.category.findMany({});
      return {
        statusCode: 200,
        categories: all,
      };
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
    });
    if (category === null) {
      throw new NotFoundException(`There is no category with id: ${id}`);
    }
    return {
      statusCode: 200,
      user: category,
    };
  }

  async update_category(updateDto: UpdateDto, token_data) {
    await this.checkData(UpdateDto, updateDto);
    if (token_data['roleId'] !== 1) {
      throw new NotFoundException();
    }

    const category = await this.prisma.category.findUnique({
      where: { id: updateDto.id },
    });
    if (category === null) {
      throw new NotFoundException(
        `There is no category with id: ${updateDto.id}`,
      );
    }

    const data: any = {};
    if (updateDto.name.length > 0) {
      data.name = updateDto.name;
    }
    if (updateDto.description.length > 0) {
      data.description = updateDto.description;
    }

    await this.prisma.category.update({
      where: { id: updateDto.id },
      data: data,
    });

    return {
      statusCode: 201,
      message: 'Category updated successfully',
    };
  }

  async remove(data: number, token_data) {
    const id = data['id'];

    if (token_data['roleId'] !== 1) {
      throw new NotFoundException();
    }

    const category = await this.prisma.category.findUnique({
      where: { id: id },
    });
    if (category === null) {
      throw new NotFoundException(`There is no category with id: ${id}`);
    }
    await this.prisma.category.delete({ where: { id: id } });

    return {
      statusCode: 204,
      message: 'Category deleted successfully',
    };
  }

  async ifAvailable(ids: number[]) {
    const promises = ids.map((id) =>
      this.prisma.category.findUnique({ where: { id } }),
    );

    const results = await Promise.all(promises);

    results.forEach((category, index) => {
      if (category === null) {
        throw new NotFoundException(
          `There is no category with id: ${ids[index]}`,
        );
      }
    });
  }

  async UpdateInPost(postId: number, categoriesId: number[]) {
    try {
      const updatedCategories = categoriesId.map((categoryId) => ({
        postId,
        categoryId,
      }));

      await this.prisma.$transaction([
        this.prisma.categoriesOnPosts.deleteMany({
          where: { postId: postId },
        }),
        this.prisma.categoriesOnPosts.createMany({
          data: updatedCategories,
        }),
      ]);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async DeleteInPost(postId: number) {
    try {
      await this.prisma.categoriesOnPosts.deleteMany({
        where: { postId: postId },
      });
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
