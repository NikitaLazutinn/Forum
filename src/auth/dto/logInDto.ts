import { IsNotEmpty, IsString } from 'class-validator';

export class logInDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class logInResponceDto {
  name: string;
  accessToken: string;
  refreshToken: string;
}
