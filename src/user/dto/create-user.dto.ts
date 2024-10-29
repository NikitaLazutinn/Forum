export class CreateUserDto {
  token: string;
}

export class FindUserDto {
  id: number;
}

export class Update_UserDto {
  token: string;
  id: number;
  params: { name: string; email: string } = { name: '', email: '' };
}

export class Delete_UserDto {
  token: string;
  id: number;
}