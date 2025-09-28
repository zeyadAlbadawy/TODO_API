import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('users/auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const newUser = await this.authService.signUp(body);
  }
}
