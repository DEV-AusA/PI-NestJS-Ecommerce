import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, MinLength } from 'class-validator';

export class ProductItemDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsNumber()
  @IsArray()
  @IsOptional()
  readonly nameEmbedding?: number[];

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNumber()
  @IsArray()
  @IsOptional()
  readonly descriptionEmbedding?: number[];

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsString({ each: true })
  readonly category: string[] | string
}
