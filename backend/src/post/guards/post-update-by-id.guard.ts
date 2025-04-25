import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from '../post.service';

@Injectable()
export class PostUpdateByIdGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    const post = await this.postService.getById(req.params.id);

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
