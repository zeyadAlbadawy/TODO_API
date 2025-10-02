import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: false })
  archieved: Boolean;

  @ManyToOne(() => User, (user) => user.lists)
  user: User;

  @OneToMany((type) => Item, (item) => item.list, {
    onDelete: 'CASCADE',
  })
  items: Item[];
}
