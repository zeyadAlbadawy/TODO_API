import { IsEmail, IsOptional, IsString } from 'class-validator';

export class updateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;
}
