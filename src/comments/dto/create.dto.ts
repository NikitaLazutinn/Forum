import { IsString } from "class-validator";

export class LikeDto {
  postId: number;
}

export class AddCommentDto {
  @IsString()
  content: string;
}

export class DeleteCommentDto {
  commentId: number;
}

export class EditCommentDto {
  @IsString()
  content: string;
}

export class ShowCommentDto {
  postId: number;
}
