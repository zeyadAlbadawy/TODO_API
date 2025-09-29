import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  // @Column()
  //   createdA

  @ManyToOne(() => User, (user) => user.lists)
  user: User;
}
