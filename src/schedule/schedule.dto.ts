// src/schedule/schedule.dto.ts
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import dayjs from 'dayjs';

export class CreateScheduleDto {
  @Transform(({ value }) => dayjs(value, 'DD/MM/YYYY').format('YYYY-MM-DD'))
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  title_brand: string;

  @IsString()
  @IsNotEmpty()
  consultant: string;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateScheduleDto extends CreateScheduleDto {}
