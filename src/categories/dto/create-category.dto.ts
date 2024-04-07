import { IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {

    // @IsString()
    // id: string;

    @IsString()
    @MaxLength(50)
    name: string;
}
