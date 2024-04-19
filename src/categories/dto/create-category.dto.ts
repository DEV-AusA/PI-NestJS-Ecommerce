import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    name: string;
}
