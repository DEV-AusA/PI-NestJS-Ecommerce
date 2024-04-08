import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

export class PaginationProductDto {
    
    @ValidateIf((page) => typeof page.parameter === 'string')
    @IsNumber()
    @IsOptional()
    page?: number;
    
    @ValidateIf((limit) => typeof limit.parameter === 'string')
    @IsNumber()
    @IsOptional()
    limit?: number;

    @IsString()
    @IsOptional()
    name?: string;
}