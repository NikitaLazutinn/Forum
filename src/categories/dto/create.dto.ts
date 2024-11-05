import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}



