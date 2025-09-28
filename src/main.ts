import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // whitelist means that any not defined prop will be removed
  // Need to implement the cookie
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
