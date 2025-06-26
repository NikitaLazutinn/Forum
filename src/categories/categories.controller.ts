import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardCustom } from 'src/guards';
import { CategoriesService } from './categories.service';
import { CreateDto, UpdateDto } from './dto/create.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuardCustom)
  @Post('create')
  async create(@Body() createDto: CreateDto, @Req() request) {
    const tokenData = request.user;
    return await this.categoriesService.create(createDto, tokenData);
  }

  @Get('all')
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoriesService.findById(+id);
  }

  @UseGuards(AuthGuardCustom)
  @Patch('edit/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateDto,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.categoriesService.update_category(+id, updateDto, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Delete('delete/:id')
  async remove(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.categoriesService.remove(+id, tokenData);
  }
}
