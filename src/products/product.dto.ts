import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title_product: string;

  @IsString()
  @IsNotEmpty()
  title_brand: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
