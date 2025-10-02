import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { UsersModule } from 'src/users/users.module';
import { UserInterceptor } from 'src/users/interceptors/user-serialize.interceptor';
import { AdminGuard } from 'src/users/guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([List]), UsersModule], // register the list entity
  controllers: [ListsController],
  providers: [ListsService, CurrentUserInterceptor, UserInterceptor], // interceptors put only inside the providers not inside the import
})
export class ListModule {}
