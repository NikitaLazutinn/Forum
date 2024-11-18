import { IsInt, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateActionDto {
  @IsString()
  @IsOptional()
  userId: number;

  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;

  @IsString()
  entity: string;

  @IsString()
  partition: string;
}
