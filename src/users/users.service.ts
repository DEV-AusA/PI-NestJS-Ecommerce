import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    get() {
        const users = {
            message: `Get users here`
        }
        return users;
    }
}
