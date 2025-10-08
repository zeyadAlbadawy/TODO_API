import { Expose, Transform } from 'class-transformer';
import { on } from 'events';

export class ItemResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  dueDate: string;

  @Expose()
  completed: Boolean;

  @Expose()
  expired: Boolean;

  @Expose()
  @Transform(({ obj }) => obj.list?.id)
  listId: string;

  @Expose()
  @Transform(({ obj }) => obj.list?.title)
  listTitle: string;

  @Expose()
  @Transform(({ obj }) => obj.list.user?.id)
  userId: string;

  @Expose()
  @Transform(({ obj }) => obj.list.user?.firstName)
  firstName: string;
}
