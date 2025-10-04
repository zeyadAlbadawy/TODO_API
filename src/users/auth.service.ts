import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as crypto from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private userService: UserService,
  ) {}

  async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

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

  async generateRandomToken(email: string) {
    const foundedUser = await this.userRepo.findOneBy({ email });
    if (!foundedUser)
      throw new NotFoundException(`There is no user with an email of ${email}`);

    const resetToken = crypto.randomBytes(32).toString('hex');

    foundedUser.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    foundedUser.passwordResetTokenExpirationDate = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    await this.userRepo.save(foundedUser);
    return resetToken;
  }

  async resetPassword(email: string, password: string, token: string) {
    const encryptedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const foundedUser = await this.userRepo.findOne({
      where: {
        email: email,
        passwordResetToken: encryptedToken,
        passwordResetTokenExpirationDate: MoreThan(new Date()),
      },
    });

    if (!foundedUser)
      throw new NotFoundException(
        `There is no user with an email of ${email} and the provided token, try again`,
      );
    foundedUser.password = await this.hashPassword(password);

    foundedUser.passwordResetToken = null;
    foundedUser.passwordResetTokenExpirationDate = null;
    await this.userRepo.save(foundedUser);

    return {
      message: 'password changed succesffully',
    };
  }
}
