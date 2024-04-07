import { IsArray, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {

    @IsString()
    @IsUUID()
    userId: string;

    @IsArray()
    products: { id: string }[];
}
