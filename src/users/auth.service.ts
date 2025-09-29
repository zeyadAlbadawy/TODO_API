import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private userService: UserService,
  ) {}

  async signUp(body: CreateUserDto) {
    const { email, firstName, lastName, password } = body;
    const foundedUser = await this.userService.find(email);
    if (foundedUser.length)
      throw new BadRequestException(
        `There is another user with the email of ${email}`,
      );

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const finalPasswordHashed = salt + '.' + hash.toString('hex');

    return this.userService.create(
      firstName,
      lastName,
      email,
      finalPasswordHashed,
    );
  }

  async login(email: string, password: string) {
    // Find if there is a user with this email
    const [User] = await this.userService.find(email);
    if (!User)
      throw new NotFoundException(
        `There is no user with the email of ${email}`,
      );

    // get the password and salt
    const [salt, hashedPassword] = User.password.split('.');
    const newHashedPassword = (await scrypt(password, salt, 32)) as Buffer;
    if (hashedPassword !== newHashedPassword.toString('hex'))
      throw new BadRequestException(
        `The email or password is incorrect, try again later`,
      );
    return User;
  }
}
