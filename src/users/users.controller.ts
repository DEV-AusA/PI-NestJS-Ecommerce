import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') //     <= endPoint
export class UsersController {
    constructor(
        private readonly userServices: UsersService
    ) {}

    @Get()
    getUser() {
        const users = this.userServices.get();
        return users;
    }
}
