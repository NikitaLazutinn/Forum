import { User } from '@prisma/client';

export class UserResponseDto {
  statusCode: number;
  message: string;
  properties: User;
}
