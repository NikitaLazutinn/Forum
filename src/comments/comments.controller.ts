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
import { AuthGuardCustom } from 'src/guards';
import { AddCommentDto, DeleteCommentDto, EditCommentDto, ShowCommentDto } from './dto/create.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuardCustom)
  @Post('add/:id')
  async add_comment(@Param('id') id: number, @Body() addCommentDto: AddCommentDto, @Req() request) {
    const tokenData = request.user;
    return this.commentService.addComment(+id,addCommentDto, tokenData);
  }

  @Get('all/:id')
  async all_comments(@Param('id') id: number) {
    return this.commentService.showComments(+id);
  }

  @UseGuards(AuthGuardCustom)
  @Patch('edit/:id')
  async update_comment(
    @Param('id') id: number,
    @Body() editCommentDto: EditCommentDto,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.commentService.editComment(+id, editCommentDto, tokenData);
  }

  @UseGuards(AuthGuardCustom)
  @Delete('delete/:id')
  async delete_comment(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.commentService.deleteComment(+id, tokenData);
  }
}
