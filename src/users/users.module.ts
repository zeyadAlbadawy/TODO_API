import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, CurrentUserInterceptor],
  imports: [TypeOrmModule.forFeature([User])], // register the user entity into the typeorm
  exports: [UserService, CurrentUserInterceptor],
})
export class UsersModule {}
