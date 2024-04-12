import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create.user.dto";
import { IsBoolean, IsOptional } from "class-validator";

// todos los campos para el update son opcionales declarando simplemente el PartialType del DTO CreateUserDto
export class UpdateUserDto extends PartialType(CreateUserDto) {

    // @IsOptional()
    // @IsBoolean()
    // isAdmin?: boolean;
}