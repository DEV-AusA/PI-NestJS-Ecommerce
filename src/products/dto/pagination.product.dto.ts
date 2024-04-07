import { IsNumber, ValidateIf } from "class-validator";

export class PaginationProductDto {
    
    @ValidateIf((page) => typeof page.parameter === 'string')
    @IsNumber()
    page?: number;
    
    @ValidateIf((limit) => typeof limit.parameter === 'string')
    @IsNumber()
    limit?: number;
}