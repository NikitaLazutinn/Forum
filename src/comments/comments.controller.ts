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
import { AuthGuard } from 'src/guards';
import { CommentService } from './comments.service';
import { AddCommentDto, DeleteCommentDto, EditCommentDto, ShowCommentDto} from './dto/create.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  async add(@Body() addCommentDto: AddCommentDto, @Req() request) {
    const tokenData = request.user;
    return this.commentService.addComment(addCommentDto, tokenData);
  }

  @Get('all')
  async show_all(@Body() showCommentDto: ShowCommentDto) {
    console.log('dfgdfgdf');
    return this.commentService.showComments(showCommentDto);
  }

  @UseGuards(AuthGuard)
  @Patch('edit')
  async edit(@Body() editCommentDto: EditCommentDto, @Req() request) {
    const tokenData = request.user;
    return this.commentService.editComment(editCommentDto, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async delete(@Body() deleteCommentDto: DeleteCommentDto, @Req() request) {
    const tokenData = request.user;
    return this.commentService.deleteComment(deleteCommentDto, tokenData);
  }
}
