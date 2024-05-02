import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: '.development.env' });

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(){
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL:process.env.CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile){
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);    
    }
}