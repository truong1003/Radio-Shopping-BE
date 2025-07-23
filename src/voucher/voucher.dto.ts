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
} from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  title_brand: string;

  @IsOptional()
  @IsNumber({}, { message: 'discount_percent must be a number' })
  @Min(0)
  @Max(100)
  discount_percent?: number;

  @IsOptional()
  @IsNumber({}, { message: 'discount_amount must be a number' })
  @Min(0)
  discount_amount?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  total_voucher: number;
}
