import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  code_sent: string;

  @IsString()
  @IsNotEmpty()
  send_type: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
