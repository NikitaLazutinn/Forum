export class CreatePostDto {
  title: string;
  content: string;
}

// update-post.dto.ts
export class UpdatePostDto {
  id: number;
  params: { title: string; content: string; published: boolean }
}

export class DeletePostDto {
  id: number;
}