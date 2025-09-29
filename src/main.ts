import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // whitelist means that any not defined prop will be removed
  app.use(
    session({
      secret: configService.getOrThrow<string>('COOKIE_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 hour
      },
    }),
  );

  // Need to implement the cookie
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
