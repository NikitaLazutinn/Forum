import { IsOptional, IsBoolean, IsInt, IsString, IsDate, IsIn, IsPositive } from 'class-validator';

export class PostFilterDto {
  @IsOptional()
  @IsString()
  createdFrom?: Date;

  @IsOptional()
  @IsString()
  createdTo?: Date;

  @IsOptional()
  @IsString()
  updatedFrom?: Date;

  @IsOptional()
  @IsString()
  updatedTo?: Date;

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

  @IsOptional()
  @IsString()
  searchQuery?: string;
}

