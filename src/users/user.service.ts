import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  find(email: string) {
    return this.userRepo.find({ where: { email } });
  }

  findOne(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  async getAllUsers() {
    return await this.userRepo.find();
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

  async update(attrs: Partial<User>, id: string) {
    const foundedUser = await this.findOne(id);
    if (!foundedUser) throw new NotFoundException(`There is no user found`);
    Object.assign(foundedUser, attrs);
    return this.userRepo.save(foundedUser);
  }

  // Just for test
  sendMail(token: string, email: string) {
    const message = `Forgot your password, try patch Request to /forget-password/${token}? If you didn't forget your password, please ignore this email!`;
    this.mailService.sendMail({
      from: 'Zeyad albadawy <zeyadalbadawyamm@gmail.com>',
      to: email,
      subject: `Password Reset`,
      text: message,
    });
  }

  sendListToUser(id: string, session: any) {}
}
