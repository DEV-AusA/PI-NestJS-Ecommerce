import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { config as dotenvConfig } from 'dotenv';
import { AuthService } from '../auth/auth.service';
import { AuthGoogle } from '../auth/dto/auth.google.dto';

dotenvConfig({ path: '.development.env' });

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(accessToken);
    // console.log(refreshToken); // verificar el token refresh undefined
    // console.log(profile);
    const authGoogle: AuthGoogle = {
      name: profile.name.givenName,
      lastName: profile.name.familyName,
      emails: profile.emails[0].value,
      photos: profile.photos[0].value,
      provider: profile.provider,
    };
    const userValidated = await this.authService.validateUserOAuth(authGoogle);
  }
}
