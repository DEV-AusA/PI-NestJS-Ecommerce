import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AdminDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}
