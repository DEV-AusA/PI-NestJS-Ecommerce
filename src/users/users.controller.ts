import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') //     <= endPoint
export class UsersController {
  // injecto la dependencia UserServices
  constructor(
    private readonly userServices: UsersService
    ) {}

  @Get()
  getUser() {
    const users = this.userServices.getUsers();
    return users;
  }
}
