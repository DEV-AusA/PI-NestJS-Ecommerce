import { IsNumber, IsOptional, IsPositive, IsString, ValidateIf } from "class-validator";

export class PaginationProductDto {
    
    @ValidateIf((page) => typeof page.parameter === 'string')
    @IsNumber()
    @IsOptional()
    @IsPositive()
    page?: number;
    
    @ValidateIf((limit) => typeof limit.parameter === 'string')
    @IsNumber()
    @IsOptional()
    @IsPositive()
    limit?: number;

    @IsString()
    @IsOptional()
    name?: string;
}