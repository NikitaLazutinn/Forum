import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/guards';
import { PostFilterDto} from './dto/filter.dto';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.create(createPostDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Get('filter-sort')
  async getFilteredPosts(@Body() filterDto: PostFilterDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.filterAndSortPosts(filterDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  findAll(@Req() request) {
    const tokenData = request.user;
    return this.postsService.findAll(tokenData);
  }

  @UseGuards(AuthGuard)
  @Get('id/:id')
  findOne(@Param('id') id: string, @Req() request) {
    const tokenData = request.user;
    return this.postsService.findOne(+id, tokenData);
  }

  @UseGuards(AuthGuard)
  @Patch('edit')
  async update(@Body() updatePostDto: UpdatePostDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.update(updatePostDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async remove(@Body() deletePostDto: DeletePostDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.remove(deletePostDto, tokenData);
  }
}
