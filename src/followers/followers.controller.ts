import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { AuthGuardCustom } from 'src/guards';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Get('show/:id')
  async show_followers(@Param('id') id: number) {
    return this.followersService.showFollowers(+id);
  }

  @UseGuards(AuthGuardCustom)
  @Patch('follow/:id')
  async follow(@Param('id') id: number, @Req() request) {
    const tokenData = request.user;
    return this.followersService.follow(+id, tokenData);
  }
}
