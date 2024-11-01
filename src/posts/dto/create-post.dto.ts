export class CreatePostDto {
  title: string;
  content: string;
}

// update-post.dto.ts
export class UpdatePostDto {
  id: number;
  params: { title: string; content: string } = {
    title: '',
    content: '',
  };
}

export class DeletePostDto {
  id: number;
}