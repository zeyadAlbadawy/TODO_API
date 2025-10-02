import { Copy } from '@nestjs/common';
import { IsUUID, IsEmail, MinLength } from 'class-validator';
import { List } from 'src/list/entities/list.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: false })
  isAdmin: Boolean;

  @Column()
  password: string;

  @OneToMany((type) => List, (list) => list.user)
  lists: List[];
}
