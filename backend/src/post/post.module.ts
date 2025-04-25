import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth.module';
import { ReactionModule } from 'reaction/reaction.module';
import { UserModule } from 'user/user.module';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ReactionModule),
  ],
  exports: [PostService, PostRepository],
})
export class PostModule {}
