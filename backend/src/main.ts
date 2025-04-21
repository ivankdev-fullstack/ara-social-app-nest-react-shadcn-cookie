import { CleanValidationPipe } from '@common/interceptors/clean-validation.pipe';
import { ResponseSerializerInterceptor } from '@common/interceptors/response-serializer.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as admin from 'firebase-admin';
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

  const serviceAccount = JSON.parse(fs.readFileSync(accountPath, 'utf8'));
  const adminConfig: admin.ServiceAccount = {
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
  });

  await app.listen(PORT);
}
bootstrap();
