import { IsNotEmpty, IsString } from 'class-validator';

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;
}
