import { forwardRef, Module } from '@nestjs/common';
import { CommentModule } from 'comment/comment.module';
import { PostModule } from 'post/post.module';
import { ReactionController } from './controller/reaction.controller';
import { ReactionRepository } from './repository/reaction.repository';
import { ReactionService } from './service/reaction.service';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService, ReactionRepository],
  imports: [forwardRef(() => PostModule), forwardRef(() => CommentModule)],
  exports: [ReactionRepository],
})
export class ReactionModule {}
