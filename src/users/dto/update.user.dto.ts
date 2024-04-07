import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create.user.dto";

// todos los campos para el update son opcionales declarando simplemente el PartialType del DTO CreateUserDto
export class UpdateUserDto extends PartialType(CreateUserDto) {}