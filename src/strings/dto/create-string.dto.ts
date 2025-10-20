import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStringDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
