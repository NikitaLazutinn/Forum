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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/guards';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.create(createPostDto, tokenData);
  }

  @Get('all')
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
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
