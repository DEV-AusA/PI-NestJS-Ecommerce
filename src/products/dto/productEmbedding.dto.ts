import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl, Length } from 'class-validator';

export class ProductEmbeddingDto {

  @IsNotEmpty()
  @IsString()
  @Length(3)
  readonly name: string;
  
  @IsNotEmpty()
  @IsString()
  readonly nameEmbedding: string;

  @IsNotEmpty()
  @IsString()
  readonly suggestionsUse: string;

  @IsNotEmpty()
  @IsString()
  readonly suggestionsUseEmbedding: number[]

}
