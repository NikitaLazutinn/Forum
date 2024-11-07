export class CreatePostDto {
  title: string;
  content: string;
  categoriesId: number[];
}

// update-post.dto.ts
export class UpdatePostDto {
  id: number;
  params: {
    title: string;
    content: string;
    published: boolean;
    categoriesId: number[];
  };
}

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

export class DeletePostDto {
  id: number;
}
