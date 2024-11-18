import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
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
  @Transform(({ value }) => parseInt(value, 10))
  skip?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  take?: number;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}

