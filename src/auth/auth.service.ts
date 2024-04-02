import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  get() {
    const auth = {
      message: `Get auth here.`,
    };

    return auth;
  }
}
