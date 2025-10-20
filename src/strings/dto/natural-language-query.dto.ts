import { IsString, IsNotEmpty } from 'class-validator';

export class NaturalLanguageQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
