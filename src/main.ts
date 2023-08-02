import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const logger = new Logger('MainGateway');
  const app = await NestFactory.create(AppModule);

  //Validações globais
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api-getway');

  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://localhost:4200',
    ],
    credentials: true,
  });

  app.useGlobalPipes();
  await app.listen(3000, () => {
    logger.log('Server is running on port 3000');
  });
}
bootstrap();
