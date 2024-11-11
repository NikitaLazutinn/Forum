import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { AuthGuard } from 'src/guards';
import { AddCommentDto, DeleteCommentDto, EditCommentDto, ShowCommentDto } from './dto/create.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  async add_comment(@Body() addCommentDto: AddCommentDto, @Req() request) {
    const tokenData = request.user;
    return this.commentService.addComment(addCommentDto, tokenData);
  }

  @Get('all')
  async all_comments(@Query() query: number) {
    return this.commentService.showComments(+query);
  }

  @UseGuards(AuthGuard)
  @Patch('edit/:id')
  async update_comment(
    @Param('id') id: number,
    @Body() editCommentDto: EditCommentDto,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.commentService.editComment(+id, editCommentDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete_comment(
    @Param('id') id: number,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.commentService.deleteComment(+id, tokenData);
  }
}
