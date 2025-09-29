import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUser } from './dtos/login-user.dto';
import { UserInterceptor } from './interceptors/user-serialize.interceptor';
import { ResponseUserDto } from './dtos/user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@UseInterceptors(new UserInterceptor(ResponseUserDto))
@Controller('users/auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const newUser = await this.authService.signUp(body);
    session.userId = newUser.id;
    return newUser;
  }

  @Post('/login')
  async loginUser(@Body() body: LoginUser, @Session() session: any) {
    const loggedInUser = await this.authService.login(
      body.email,
      body.password,
    );
    session.userId = loggedInUser.id;
    return loggedInUser;
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateUser(@Body() body: updateUserDto, @Param('id') id: string) {
    return this.userService.update(body, id);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logoutUser(@Session() session: any) {
    session.userId = undefined;
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(CurrentUserInterceptor)
  @Get('/whoami')
  whoami(@CurrentUser() user: User) {
    return user;
  }
}
