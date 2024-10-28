import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';


@Injectable()
export class UserService {
  decode(data){
    try{
    const secret = process.env.JWT_SECRET;
    const verifiedPayload = jwt.verify(data.token, secret); 
    return verifiedPayload;
    }catch(err){
      console.log(err);
      throw new BadRequestException('Invalid token');
    }
    
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(token:string) {
    //if(id == req)
    const data = this.decode(token);
    return data;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
