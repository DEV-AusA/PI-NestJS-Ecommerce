import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  //injecto la dependencia UsersRepository
  constructor(
    private usersRepository: UsersRepository
  ) {}

  getUsers() {
    const users = this.usersRepository.getUsers();
    return users;
  }
}
