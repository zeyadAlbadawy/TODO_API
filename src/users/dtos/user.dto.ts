import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;
}
