import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CustomerStatus } from 'src/types/type';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  brand_favorite: string;

  @IsOptional()
  @IsNumber()
  order_amount?: number;

  @IsOptional()
  @IsString()
  product: string;

  @IsString()
  @IsNotEmpty()
  status: CustomerStatus;

  @IsString()
  @IsNotEmpty()
  note: string;
}
