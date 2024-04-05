import { IsNumber } from "class-validator";

export class PaginationProductDto {
    @IsNumber()
    page?: number;
    
    @IsNumber()
    limit?: number;
}