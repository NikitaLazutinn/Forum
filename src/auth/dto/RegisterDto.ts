import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class RegisterResponseDto {
  statusCode: number;
  message: string;
  properties: {name:string, email:string};
}
