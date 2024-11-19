import {
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { ImgurService } from './imgur.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('img')
export class ImgurController {
  constructor(private readonly imgurService: ImgurService) {}

  @UseGuards(AuthGuard)
  @Post('add-profile-photo')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async addProfilePhoto(
    @UploadedFile()
    file,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.imgurService.addProfilePhoto(file, tokenData);
  }

  @UseGuards(AuthGuard)
  @Patch('change-profile-photo')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async changeProfilePhoto(
    @UploadedFile()
    file,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.imgurService.changeProfilePhoto(file, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-profile-photo')
  async deleteProfilePhoto(@Req() request,) {
    const tokenData = request.user;
    return this.imgurService.deleteProfilePhoto(tokenData);
  }

  @UseGuards(AuthGuard)
  @Post(':postId/add-image')
  @UseInterceptors(FileInterceptor('postImage'))
  async addPostImage(
    @Param('postId') postId: number,
    @UploadedFile() file,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.imgurService.addPostImage(+postId, file, tokenData);
  }

  @UseGuards(AuthGuard)
  @Patch(':postId/update-image')
  @UseInterceptors(FileInterceptor('postImage'))
  async updatePostImage(
    @Param('postId') postId: number,
    @UploadedFile() file,
    @Req() request,
  ) {
    const tokenData = request.user;
    return this.imgurService.updatePostImage(+postId, file, tokenData);
  }

  @UseGuards(AuthGuard)
  @Delete(':postId/delete-image')
  async deletePostImage(@Param('postId') postId: number, @Req() request) {
    const tokenData = request.user;
    return this.imgurService.deletePostImage(+postId, tokenData);
  }
}
