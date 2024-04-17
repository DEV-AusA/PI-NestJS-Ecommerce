import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Length, MinLength } from 'class-validator';

export class ProductDto {
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

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly imgUrl: string;

  @IsNotEmpty()
  @IsString({ each: true })
  // @IsArray()
  readonly category: string[] | string
}
