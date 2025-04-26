import { CleanValidationPipe } from '@common/interceptors/clean-validation.pipe';
import { ResponseSerializerInterceptor } from '@common/interceptors/response-serializer.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const refrector = app.get(Reflector);

  app
    .useGlobalPipes(new CleanValidationPipe())
    .useGlobalInterceptors(new ResponseSerializerInterceptor(refrector))
    .enableCors({
      origin: process.env.CLIENT_URL,
    });

  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get<string>('PORT') || 3333;

  await app.listen(PORT);
}
bootstrap();
