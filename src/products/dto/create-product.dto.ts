import { IsBoolean, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  stock: boolean;

  @IsString()
  @IsUrl()
  imgUrl: string;
}
