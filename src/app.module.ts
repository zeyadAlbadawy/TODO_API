import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ListModule } from './list/list.module';
import { ItemModule } from './item/item.module';
import { List } from './list/entities/list.entity';
import { Item } from './item/entities/item.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './users/interceptors/current-user.interceptor';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: +configService.get('DB_PORT'),
          password: configService.get<string>('DB_PASSWORD'),
          username: configService.get<string>('DB_USER_NAME'),
          entities: [User, List, Item],
          database: 'todo_api',
          synchronize: true,
          logging: true,
        };
      },
    }),
    ListModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class AppModule {}
