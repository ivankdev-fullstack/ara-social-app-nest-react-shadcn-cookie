import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth.module';
import { PostModule } from 'post/post.module';
import { ReactionModule } from 'reaction/reaction.module';
import { UserModule } from 'user/user.module';
import { CommentController } from './controller/comment.controller';
import { CommentRepository } from './repository/comment.repository';
import { CommentService } from './service/comment.service';

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
