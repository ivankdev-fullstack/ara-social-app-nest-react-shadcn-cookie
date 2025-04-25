import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth.module';
import { PostModule } from 'post/post.module';
import { ReactionModule } from 'reaction/reaction.module';
import { UserModule } from 'user/user.module';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  imports: [
    forwardRef(() => PostModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ReactionModule),
  ],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
