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
import {
  LikeDto,
  CreatePostDto,
  DeletePostDto,
  UpdatePostDto,
} from './dto/create-post.dto';
import { AuthGuard } from 'src/guards';
import { PostFilterDto } from './dto/filter.dto';
import { ShowCommentDto,
  AddCommentDto,
  DeleteCommentDto,
  EditCommentDto} from './dto/comment_dto';

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
  @Post('add_comment')
  async add_comment(@Body() addCommentDto: AddCommentDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.addComment(addCommentDto, tokenData);
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
  async findOne(@Param('id') id: string, @Req() request) {
    const tokenData = request.user;
    return this.postsService.findOne(+id, tokenData);
  }

  @Get('all_comments')
  async all_comments(@Body() showCommentDto: ShowCommentDto) {
    return this.postsService.allComments(showCommentDto);
  }

  @Get('show_likes')
  async all_likes(@Body() likeDto: LikeDto) {
    return this.postsService.showLikes(likeDto);
  }

  @UseGuards(AuthGuard)
  @Patch('edit')
  async update(@Body() updatePostDto: UpdatePostDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.update(updatePostDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Patch('edit_comment')
  async update_comment(@Body() editCommentDto: EditCommentDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.updateComment(editCommentDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Patch('like')
  async like(@Body() likeDto: LikeDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.like(likeDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async remove(@Body() deletePostDto: DeletePostDto, @Req() request) {
    const tokenData = request.user;
    return this.postsService.remove(deletePostDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete_comment')
  async delete_comment(
    @Body() deleteCommentDto: DeleteCommentDto,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.postsService.deleteComment(deleteCommentDto, tokenData);
  }
}
