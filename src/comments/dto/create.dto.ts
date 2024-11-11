export class LikeDto {
  postId: number;
}

export class AddCommentDto {
  postId: number;
  content: string;
}

export class DeleteCommentDto {
  commentId: number;
}

export class EditCommentDto {
  content: string;
}

export class ShowCommentDto {
  postId: number;
}
