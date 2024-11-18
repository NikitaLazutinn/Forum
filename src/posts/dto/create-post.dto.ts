import { IsArray, IsBoolean, IsInt, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsArray()
  categoriesId: number[];
}

// update-post.dto.ts
export class UpdatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsBoolean()
  published: boolean;
  @IsArray()
  @IsInt({ each: true })
  categoriesId: number[];
}

export class LikeDto {
  postId: number;
}

export class DeletePostDto {
  id: number;
}


