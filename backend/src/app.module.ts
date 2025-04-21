import { getEnvFile } from '@common/config/env';
import { JwtAuthMiddleware } from '@common/middlewares/jwt-auth.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { FirestoreModule } from './firestore/firestore.module';
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
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude('/auth/login', '/auth/register')
      .forRoutes('*');
  }
}
