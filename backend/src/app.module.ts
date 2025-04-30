import { getEnvFile } from '@common/config/env';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from 'firebase/firebase-auth.guard';
import { FirebaseModule } from 'firebase/firebase.module';
import { FirestoreModule } from 'firestore/firestore.module';
import { AlgoliaModule } from './algoria/algolia.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { ReactionModule } from './reaction/reaction.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFile(),
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),
    FirebaseModule,
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    ReactionModule,
    AlgoliaModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AppModule {}
