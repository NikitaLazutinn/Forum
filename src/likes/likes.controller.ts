import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { LiklesService } from './likes.service';
import { LikeDto } from './dto/create.dto';
import { AuthGuardCustom } from 'src/guards';

@Controller('likes')
export class LiklesController {
  constructor(private readonly liklesService: LiklesService) {}

  @Get('show_likes/:id')
  async all_likes(@Param('id') id: number) {
    return this.liklesService.showLikes(+id);
  }

  @UseGuards(AuthGuardCustom)
  @Patch('like/:id')
  async like(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.liklesService.like(+id, tokenData);
  }
}
