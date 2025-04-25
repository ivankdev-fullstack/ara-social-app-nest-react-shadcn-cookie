import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentService } from 'comment/comment.service';

@Injectable()
export class CommentDeleteByIdGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    const post = await this.commentService.getById(req.params.id);

    try {
      if (userId !== post.user.id) {
        throw new UnauthorizedException(
          'User ID in token does not match the request body one',
        );
      }

      return true;
    } catch (err) {
      throw new InternalServerErrorException(
        'Error while verifying token',
        err,
      );
    }
  }
}
