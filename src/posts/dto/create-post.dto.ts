export class CreatePostDto {
  title: string;
  content: string;
  token: string;
}

// update-post.dto.ts
export class UpdatePostDto {
  token: string;
  id: number;
  params: { title: string; content: string } = {
    title: '',
    content: '',
  };
}

export class DeletePostDto {
  token: string;
  id: number;
}