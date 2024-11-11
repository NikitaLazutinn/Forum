import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddCommentDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class EditCommentDto {
  @IsNotEmpty()
  @IsNumber()
  commentId: number;
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class DeleteCommentDto {
  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}

export class ShowCommentDto {
  @IsNotEmpty()
  @IsNumber()
  postId: number;
}