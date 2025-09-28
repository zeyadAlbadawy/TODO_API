import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  find(email: string) {
    return this.userRepo.find({ where: { email } });
  }

  findOne(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  create(firstName: string, lastName: string, email: string, password: string) {
    const newUser = this.userRepo.create({
      firstName,
      lastName,
      email,
      password,
    });

    return this.userRepo.save(newUser);
  }
}
