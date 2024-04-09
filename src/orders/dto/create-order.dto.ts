import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    products: { id: string }[];
}
