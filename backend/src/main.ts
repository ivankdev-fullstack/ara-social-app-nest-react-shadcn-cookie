import { CleanValidationPipe } from '@common/interceptors/clean-validation.pipe';
import { ResponseSerializerInterceptor } from '@common/interceptors/response-serializer.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const refrector = app.get(Reflector);

  app
    .useGlobalPipes(new CleanValidationPipe())
    .useGlobalInterceptors(new ResponseSerializerInterceptor(refrector))
    .use(cookieParser())
    .enableCors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    });

  const configService: ConfigService = app.get(ConfigService);

  const PORT = configService.get<string>('PORT') || 3333;
  const accountPath = configService.get<string>('SA_KEY');

  if (!accountPath || !fs.existsSync(accountPath)) {
    throw new Error('Firebase service account file not found!');
  }

  await app.listen(PORT);
}
bootstrap();
