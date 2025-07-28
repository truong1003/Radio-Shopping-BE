import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsInt,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { DiscountType } from 'src/types/type';

export class CreateVoucherDto {
  @IsString()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  title_brand: string;

  @IsString()
  @IsNotEmpty()
  product_apply: string;

  @IsEnum(DiscountType)
  discount_type: DiscountType;

  @IsString()
  discount_value: number;

  @IsOptional()
  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  total_voucher: number;
}
