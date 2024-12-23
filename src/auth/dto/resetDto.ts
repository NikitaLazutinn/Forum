import { IsNotEmpty, IsString } from 'class-validator';

export class ResetDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class linkResetResp {
  statusCode: number;
  message: string;
}
