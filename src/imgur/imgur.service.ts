import { UserService } from 'src/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class ImgurService {
  constructor(
    private readonly userService: UserService,
    private readonly postsService: PostsService,
  ) {}

  private async uploadToImgur(file) {
    const formData = new FormData();
    formData.append('image', file.buffer, file.originalname);

    try {
      const response = await axios.post(process.env.IMGUR_URL, formData, {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          ...formData.getHeaders(),
        },
      });
      const { link, deletehash } = response.data?.data;
      if (link && deletehash) {
        return { link, deletehash };
      }
      throw new BadRequestException('Something went wrong');
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  private async deleteImageFromImgur(deletehash: string) {
    await axios.delete(`${process.env.IMGUR_URL}/${deletehash}`, {
      headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` },
    });
  }

  async addPostImage(postId: number, file, token_data: string) {
    const post = await this.postsService.findById(postId, token_data);

    const userId = token_data['id'];
    if (token_data['roleId'] !== 1 && userId !== post.userId) {
      throw new NotFoundException();
    }

    if (post.image) {
      throw new BadRequestException('Image already exists here!');
    }

    const { link: imageUrl, deletehash } = await this.uploadToImgur(file);
    await this.postsService.uploadImage(postId, imageUrl, deletehash);

    return { message: 'Post image has been added successfully!' };
  }

  async updatePostImage(postId: number, file, token_data: string) {
    const post = await this.postsService.findById(postId, token_data);

    const userId = token_data['id'];
    if (token_data['roleId'] !== 1 && userId !== post.userId) {
      throw new NotFoundException();
    }

    if (post.image && post.deleteHash) {
      await this.deleteImageFromImgur(post.deleteHash);
    }

    const { link: imageUrl, deletehash } = await this.uploadToImgur(file);
    await this.postsService.uploadImage(postId, imageUrl, deletehash);

    return { message: 'Post image updated successfully!' };
  }

  async deletePostImage(postId: number, token_data: string) {
    const post = await this.postsService.findById(postId, token_data);

    const userId = token_data['id'];
    if (token_data['roleId'] !== 1 && userId !== post.userId) {
      throw new NotFoundException();
    }

    if (!post.image || !post.deleteHash) {
      throw new BadRequestException('There is no image to delete!');
    }

    await this.deleteImageFromImgur(post.deleteHash);
    await this.postsService.deleteImage(post.id);

    return { message: 'Post image has been deleted successfully!' };
  }

  async addProfilePhoto(file, token_data: string) {
    const userId = token_data['id'];

    const user = await this.userService.find(userId);

    if (user.profilePhoto) {
      throw new BadRequestException('Profile photo already exists');
    }

    const { link: uploadedImageUrl, deletehash } =
      await this.uploadToImgur(file);

    await this.userService.uploadProfilePhoto(
      userId,
      uploadedImageUrl,
      deletehash,
    );

    return { message: 'Profile photo has been added successfully!' };
  }

  async changeProfilePhoto(file, token_data: string) {
    const userId = token_data['id'];

    const user = await this.userService.find(userId);

    if (!user.profilePhoto) {
      throw new BadRequestException('Profile photo doesn`t exist');
    }

    await this.deleteImageFromImgur(user.deleteHash);

    const { link: uploadedImageUrl, deletehash } =
      await this.uploadToImgur(file);

    await this.userService.updateProfilePhoto(
      userId,
      uploadedImageUrl,
      deletehash,
    );

    return { message: 'Profile photo has been updated successfully!' };
  }

  async deleteProfilePhoto(token_data: string) {
    const userId = token_data['id'];

    const user = await this.userService.find(userId);

    if (!user.profilePhoto) {
      throw new BadRequestException('Profile photo doesn`t exist');
    }

    await this.deleteImageFromImgur(user.deleteHash);

    await this.userService.deleteProfilePhoto(userId);

    return { message: 'Profile photo has been deleted successfully!' };
  }
}
