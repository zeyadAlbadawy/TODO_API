import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string; // '2025-10-08T17:00:00Z'
}
