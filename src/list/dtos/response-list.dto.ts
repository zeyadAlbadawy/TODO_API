import { Expose, Transform } from 'class-transformer';

export class ListResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  archieved: Boolean;

  @Transform(({ obj }) => obj.user?.id)
  @Expose()
  userId: string;

  @Transform(({ obj }) => obj.user?.firstName)
  @Expose()
  firstName: string;
}
