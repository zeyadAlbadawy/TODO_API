import { Expose, Transform } from 'class-transformer';
import { List } from 'src/list/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  completed: Boolean;

  @ManyToOne(() => List, (list) => list.items, {
    onDelete: 'CASCADE',
  })
  list: List;
}
