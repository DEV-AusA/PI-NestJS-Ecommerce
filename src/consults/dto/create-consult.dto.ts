import { IsNotEmpty, IsString } from "class-validator";

export class CreateConsultDto {
    @IsNotEmpty()
    @IsString()
    consult: string
}
