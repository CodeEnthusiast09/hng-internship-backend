import {
  IsOptional,
  IsBoolean,
  IsInt,
  IsString,
  Min,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterStringsDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_palindrome?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_length?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_length?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  word_count?: number;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  contains_character?: string;
}
