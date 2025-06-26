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
import {
  LikeDto,
  CreatePostDto,
  UpdatePostDto,
} from './dto/create-post.dto';
import { AuthGuardCustom } from 'src/guards';
import { PostFilterDto } from './dto/filter.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuardCustom)
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.create(createPostDto, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Get('filter-sort')
   async getFilteredPosts(@Query() filterDto: PostFilterDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.filterAndSortPosts(filterDto, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Get('all')
  findAll(@Req() request) {
    const tokenData = request.user;
    return this.postsService.findAll(tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Get('id/:id')
  async findOne(@Param('id') id: string, @Req() request) {
    const tokenData = request.user;
    return this.postsService.findOne(+id, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Patch('edit/:id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.postsService.update(+id, updatePostDto, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Delete('delete/:id')
  async remove(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.postsService.remove(+id, tokenData);
  }
}
