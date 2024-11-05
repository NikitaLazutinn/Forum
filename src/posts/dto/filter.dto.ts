import { IsOptional, IsBoolean, IsInt, IsString, IsDate, IsIn, IsPositive } from 'class-validator';

export class PostFilterDto {
  @IsOptional()
  @IsString()
  published?: boolean;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsString()
  @IsIn(['title', 'content', 'createdAt', 'updatedAt'])
  sortField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsInt()
  @IsPositive()
  skip?: number; 

  @IsOptional()
  @IsInt()
  @IsPositive()
  take?: number;
}

