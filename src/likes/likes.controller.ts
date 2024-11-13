import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { LiklesService } from './likes.service';
import { LikeDto } from './dto/create.dto';
import { AuthGuard } from 'src/guards';

@Controller('likes')
export class LiklesController {
  constructor(private readonly liklesService: LiklesService) {}

  @Get('show_likes')
  async all_likes(@Query() likeDto: LikeDto) {
    return this.liklesService.showLikes(likeDto);
  }

  @UseGuards(AuthGuard)
  @Patch('like/:id')
  async like(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.liklesService.like(+id, tokenData);
  }
}
