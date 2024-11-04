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
      throw new BadRequestException('Only admin can create categories!');
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

  async findByName(name: string) {
    const category = await this.prisma.category.findUnique({
      where: { name: name },
    });
    if (category === null) {
      throw new NotFoundException(`There is no category with name: ${name}`);
    }
    return {
      statusCode: 200,
      user: category,
    };
  }

  async update_category(updateDto: UpdateDto, token_data) {
    await this.checkData(UpdateDto, updateDto);
    if (token_data['roleId'] !== 1) {
      throw new BadRequestException(
        'Only admin can update parametrs of categories!',
      );
    }

    const category = await this.prisma.category.findUnique({
      where: { name: updateDto.name },
    });
    if (category === null) {
      throw new NotFoundException(
        `There is no category with name: ${updateDto.name}`,
      );
    }

      await this.prisma.category.update({
        where: { name: updateDto.name },
        data: {
          description: updateDto.description,
        },
      });
    
    return {
      statusCode: 201,
      message: 'Category updated successfully',
    };
  }

  async remove(data: string, token_data) {
    const name = data['name'];

    if (token_data['roleId'] !== 1) {
      throw new BadRequestException('Only admin can delete categories!');
    }

    const category = await this.prisma.category.findUnique({
      where: { name: name },
    });
    if (category === null) {
      throw new NotFoundException(
        `There is no category with name: ${name}`,
      );
    }
    await this.prisma.category.delete({ where: { name: name} });

    return {
      statusCode: 204,
      message: 'Category deleted successfully',
    };
  }

  async ifAvaiable(ids:number[]){
   for(let i = 0; i < ids.length; i++){
    const m = await this.prisma.category.findUnique({where: { id: ids[i]}});
    if(m === null){
      throw new NotFoundException(`There is no category with id: ${ids[i]}`);
    }
   }
    
  }

}
