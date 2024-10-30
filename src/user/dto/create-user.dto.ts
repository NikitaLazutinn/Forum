export class CreateUserDto {
  token: string;
}

export class Update_UserDto {
  token: string;
  id: number;
  params: { name: string; email: string; password: string } = { name: '', email: '', password: '' };
}

export class Delete_UserDto {
  token: string;
  id: number;
}