import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {

  //injecto la dependencia UsersRepository
  constructor(
    private readonly usersRepository: UsersRepository
    ) {}
    
    getUsers() {
      const users = this.usersRepository.getUsers();
      return users;
    }

    getUserById(id: number) {
      const user = this.usersRepository.getUserById(id);
      return user;
    }

    getUserByName(name: string) {
      const userByName = this.usersRepository.getUserByName(name);
      return userByName;
    }

    createUser(createUserDto: CreateUserDto) {
      const newUser = this.usersRepository.createUser(createUserDto);
      return newUser;
    }

    updateUser(id: number, updateUserDto: UpdateUserDto) {
      const messageUserUpdated = this.usersRepository.updateUser(id, updateUserDto);
      return messageUserUpdated;
    }

    deleteUser(id: number) {
      const messageUserDeleted = this.usersRepository.deleteUser(id);
      return messageUserDeleted;
    }
}
