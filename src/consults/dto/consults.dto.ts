import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ConsultDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly consult: string;

}
